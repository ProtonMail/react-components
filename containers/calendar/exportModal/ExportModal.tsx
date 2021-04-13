import { noop } from 'proton-shared/lib/helpers/function';
import {
    Calendar,
    EXPORT_STEPS,
    ExportCalendarModel,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';
import React, { useState, useEffect, useMemo } from 'react';
import { c } from 'ttag';

import { getEventsCount } from 'proton-shared/lib/api/calendars';
import { Address } from 'proton-shared/lib/interfaces';
import { getProdId } from 'proton-shared/lib/calendar/vcalHelper';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { DEFAULT_CALENDAR_USER_SETTINGS } from 'proton-shared/lib/calendar/calendar';
import { getTimezone } from 'proton-shared/lib/date/timezone';
import { generateVtimezonesComponents } from 'proton-shared/lib/calendar/integration/invite';
import { unique } from 'proton-shared/lib/helpers/array';
import { Button, FormModal, PrimaryButton } from '../../../components';
import ExportingModalContent from './ExportingModalContent';
import ExportSummaryModalContent from './ExportSummaryModalContent';
import { useApi, useCalendarUserSettings, useConfig, useGetAddresses } from '../../../hooks';
import { createExportIcs } from './createExportIcs';
import { getDefaultTzid } from '../../../../proton-calendar/src/app/containers/calendar/getSettings';
import { useGetVTimezones } from '../../../hooks/useGetVtimezones';

interface Props {
    calendar: Calendar;
    onClose?: () => void;
}

export const ExportModal = ({ calendar, ...rest }: Props) => {
    const api = useApi();
    const getAddresses = useGetAddresses();
    const config = useConfig();

    const getVTimezones = useGetVTimezones();
    const [calendarUserSettings = DEFAULT_CALENDAR_USER_SETTINGS] = useCalendarUserSettings();
    const localTzid = getTimezone();
    const defaultTzid = getDefaultTzid(calendarUserSettings, localTzid);

    const prodId = useMemo(() => getProdId(config), [config]);

    const [model, setModel] = useState<ExportCalendarModel>({
        step: EXPORT_STEPS.EXPORTING,
        totalProcessed: [],
        totalToProcess: 0,
        calendar,
    });
    const [addresses, setAddresses] = useState<Address[]>();

    const { content, ...modalProps } = (() => {
        if (model.step === EXPORT_STEPS.FETCHING_DEPENDENCIES) {
            return {
                content: <>Fetching dependencies</>,
            };
        }

        if (model.step === EXPORT_STEPS.ERROR_FETCHING_DEPENDENCIES) {
            return {
                content: <>Error fetching dependencies</>,
            };
        }

        if (model.step <= EXPORT_STEPS.WARNING) {
            //
        }

        if (model.step === EXPORT_STEPS.EXPORTING) {
            const submit = (
                <Button color="norm" disabled type="submit">
                    {c('Action').t`Continue`}
                </Button>
            );

            const handleFinish = async (exportedEvents: VcalVeventComponent[]) => {
                const vtimezones = (
                    await Promise.all(
                        exportedEvents.map((vevent) => generateVtimezonesComponents(vevent, getVTimezones))
                    )
                )
                    .filter((vtimezoneComponents) => vtimezoneComponents.length)
                    .flat();
                const uniqueTimezones = unique(vtimezones);

                setModel((model) => ({ ...model, step: EXPORT_STEPS.FINISHED }));
                const ics = createExportIcs({
                    calendar,
                    prodId,
                    events: exportedEvents,
                    defaultTzid,
                    vtimezones: uniqueTimezones,
                });
                const blob = new Blob([ics], { type: 'data:text/plain;charset=utf-8;' });

                downloadFile(blob, `${calendar.Name}.ics`);
            };

            return {
                content: (
                    <ExportingModalContent
                        model={model}
                        setModel={setModel}
                        onFinish={handleFinish}
                        addresses={addresses!}
                    />
                ),
                submit,
                onSubmit: noop,
            };
        }
        // model.step === IMPORT_STEPS.FINISHED at this stage
        const submit = <PrimaryButton type="submit">{c('Action').t`Close`}</PrimaryButton>;

        return {
            content: <ExportSummaryModalContent model={model} />,
            submit,
            close: null,
            onSubmit: rest.onClose,
        };
    })();

    const calendarName = calendar.Name;

    useEffect(() => {
        void (async () => {
            try {
                setModel({ ...model, step: EXPORT_STEPS.FETCHING_DEPENDENCIES });
                const addresses = await getAddresses();

                if (!addresses) {
                    throw new Error('No addresses');
                }

                setAddresses(addresses);

                const countResponse = await api<{ Total: number }>(getEventsCount(calendar.ID));
                setModel({ ...model, totalToProcess: countResponse.Total });

                setModel({ ...model, step: EXPORT_STEPS.EXPORTING });
            } catch (error) {
                setModel({ ...model, step: EXPORT_STEPS.ERROR_FETCHING_DEPENDENCIES });
            }
        })();
    }, []);

    return (
        <FormModal title={c('Title').t`Exporting calendar ${calendarName}`} {...modalProps} {...rest}>
            {/* <pre>{JSON.stringify(model.totalProcessed, null, 2)}</pre> */}
            {content}
        </FormModal>
    );
};

export default ExportModal;
