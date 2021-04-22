import { createExportIcs } from 'proton-shared/lib/calendar/export/createExportIcs';
import { getUniqueVtimezones } from 'proton-shared/lib/calendar/vtimezoneHelper';
import {
    Calendar,
    CalendarEvent,
    EXPORT_ERRORS,
    EXPORT_STEPS,
    ExportCalendarModel,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';
import React, { useEffect, useState } from 'react';
import { c } from 'ttag';

import { getProdIdFromNameAndVersion } from 'proton-shared/lib/calendar/vcalHelper';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { DEFAULT_CALENDAR_USER_SETTINGS } from 'proton-shared/lib/calendar/calendar';
import { format } from 'date-fns';
import { getAppHref, getClientID } from 'proton-shared/lib/apps/helper';
import { APPS } from 'proton-shared/lib/constants';
import { Button, FormModal } from '../../../components';
import { useGetVtimezonesMap } from '../../../hooks/useGetVtimezonesMap';
import ExportingModalContent from './ExportingModalContent';
import ExportSummaryModalContent from './ExportSummaryModalContent';
import { useCalendarUserSettings } from '../../../hooks';

interface Props {
    calendar: Calendar;
    onClose?: () => void;
}

export const ExportModal = ({ calendar, ...rest }: Props) => {
    const [prodId, setProdId] = useState<string>();

    const getVTimezonesMap = useGetVtimezonesMap();
    const [calendarUserSettings = DEFAULT_CALENDAR_USER_SETTINGS] = useCalendarUserSettings();
    const { PrimaryTimezone: defaultTzid } = calendarUserSettings;

    const [model, setModel] = useState<ExportCalendarModel>({
        step: EXPORT_STEPS.EXPORTING,
        totalProcessed: [],
        erroredEvents: [],
        totalToProcess: 0,
        calendar,
    });
    const updateModel = (changes: Partial<ExportCalendarModel>) =>
        setModel((currentModel: ExportCalendarModel) => ({ ...currentModel, ...changes }));

    const [calendarBlob, setCalendarBlob] = useState<Blob>();

    const { content, ...modalProps } = (() => {
        if (model.step === EXPORT_STEPS.EXPORTING) {
            const handleFinish = async (exportedEvents: VcalVeventComponent[], erroredEvents: CalendarEvent[]) => {
                const uniqueTimezones = await getUniqueVtimezones({
                    vevents: exportedEvents,
                    tzids: [defaultTzid],
                    getVTimezonesMap,
                });

                if (!prodId) {
                    throw new Error('Missing prodId');
                }

                const ics = createExportIcs({
                    calendar,
                    prodId,
                    events: exportedEvents,
                    defaultTzid,
                    vtimezones: uniqueTimezones,
                });
                updateModel({ step: EXPORT_STEPS.FINISHED, erroredEvents });
                setCalendarBlob(new Blob([ics], { type: 'data:text/plain;charset=utf-8;' }));
            };

            return {
                content: <ExportingModalContent model={model} setModel={setModel} onFinish={handleFinish} />,
                submit: null,
            };
        }
        const submit =
            model.error === EXPORT_ERRORS.NETWORK_ERROR ? (
                <Button color="norm" onClick={() => updateModel({ step: EXPORT_STEPS.EXPORTING })}>{c('Action')
                    .t`Try again`}</Button>
            ) : (
                <Button color="norm" type="submit">{c('Action').t`Save ICS file`}</Button>
            );

        return {
            content: <ExportSummaryModalContent model={model} />,
            submit,
            onSubmit: () => {
                downloadFile(calendarBlob, `${calendar.Name}-${format(Date.now(), 'yyyy-MM-dd')}.ics`);
                rest.onClose?.();
            },
        };
    })();

    useEffect(() => {
        const clientId = getClientID(APPS.PROTONCALENDAR);

        try {
            void (async () => {
                const { version } = await (await fetch(getAppHref('/assets/version.json', APPS.PROTONCALENDAR))).json();

                setProdId(getProdIdFromNameAndVersion(clientId, version));
            })();
        } catch {
            setProdId(getProdIdFromNameAndVersion(clientId, `4.1.11`));
            // setModel((currentModel) => ({
            //     ...currentModel,
            //     step: EXPORT_STEPS.FINISHED,
            //     totalProcessed: [],
            //     erroredEvents: [],
            //     totalToProcess: 0,
            //     error: EXPORT_ERRORS.NETWORK_ERROR,
            // }));
        }
    }, []);

    return (
        <FormModal title={c('Title').t`Exporting calendar`} {...modalProps} {...rest}>
            {content}
        </FormModal>
    );
};

export default ExportModal;
