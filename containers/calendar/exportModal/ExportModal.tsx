import { noop } from 'proton-shared/lib/helpers/function';
import {
    Calendar,
    CalendarEvent,
    EXPORT_STEPS,
    ExportCalendarModel,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';
import React, { useMemo, useState } from 'react';
import { c } from 'ttag';

import { getProdId, getPropertyTzid } from 'proton-shared/lib/calendar/vcalHelper';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { DEFAULT_CALENDAR_USER_SETTINGS } from 'proton-shared/lib/calendar/calendar';
import { uniqueBy } from 'proton-shared/lib/helpers/array';
import { Button, FormModal } from '../../../components';
import ExportingModalContent from './ExportingModalContent';
import ExportSummaryModalContent from './ExportSummaryModalContent';
import { useCalendarUserSettings, useConfig } from '../../../hooks';
import { createExportIcs } from './createExportIcs';
import { useGetVTimezones } from '../../../hooks/useGetVtimezones';

interface Props {
    calendar: Calendar;
    onClose?: () => void;
}

export const ExportModal = ({ calendar, ...rest }: Props) => {
    const config = useConfig();

    const getVTimezones = useGetVTimezones();
    const [calendarUserSettings = DEFAULT_CALENDAR_USER_SETTINGS] = useCalendarUserSettings();
    const { PrimaryTimezone: defaultTzid } = calendarUserSettings;

    const prodId = useMemo(() => getProdId(config), [config]);

    const [model, setModel] = useState<ExportCalendarModel>({
        step: EXPORT_STEPS.EXPORTING,
        totalProcessed: [],
        erroredEvents: [],
        totalToProcess: 0,
        calendar,
    });
    const updateModel = (changes: Partial<ExportCalendarModel>) =>
        setModel((currentModel) => ({ ...currentModel, ...changes }));

    const [calendarBlob, setCalendarBlob] = useState<Blob>();

    const { content, ...modalProps } = (() => {
        if (model.step === EXPORT_STEPS.EXPORTING) {
            const handleFinish = async (exportedEvents: VcalVeventComponent[], erroredEvents: CalendarEvent[]) => {
                const vtimezones = Object.values(
                    await getVTimezones(
                        await Promise.all(
                            exportedEvents.flatMap(({ dtstart, dtend }) =>
                                [dtstart, dtend]
                                    .flatMap((date) => (date ? [date] : []))
                                    .map(getPropertyTzid)
                                    .flatMap((tzid) => (tzid ? [tzid] : []))
                            )
                        )
                    )
                ).flatMap((vtimezoneObj) => (vtimezoneObj ? [vtimezoneObj.vtimezone] : []));
                const uniqueTimezones = uniqueBy(vtimezones, (tz) => tz.tzid.value);

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

            const submit = (
                <Button color="norm" disabled type="submit">
                    {c('Action').t`Continue`}
                </Button>
            );

            return {
                content: <ExportingModalContent model={model} setModel={setModel} onFinish={handleFinish} />,
                submit,
                onSubmit: noop,
            };
        }
        const submit = <Button color="norm" type="submit">{c('Action').t`Save ICS file`}</Button>;

        return {
            content: <ExportSummaryModalContent model={model} />,
            submit,
            onSubmit: () => {
                downloadFile(calendarBlob, `${calendar.Name}.ics`);
                rest.onClose?.();
            },
        };
    })();

    return (
        <FormModal title={c('Title').t`Exporting calendar`} {...modalProps} {...rest}>
            {content}
        </FormModal>
    );
};

export default ExportModal;
