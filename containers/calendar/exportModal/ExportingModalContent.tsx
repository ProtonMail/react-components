import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { c } from 'ttag';

import {
    CalendarEvent,
    EXPORT_STEPS,
    ExportCalendarModel,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';
import { processInBatches } from 'proton-shared/lib/calendar/decryptEvents';

import { Address } from 'proton-shared/lib/interfaces';
import { Alert, DynamicProgress } from '../../../components';
import { useApi, useBeforeUnload, useGetAddressKeys, useGetCalendarKeys } from '../../../hooks';
import useGetEncryptionPreferences from '../../../hooks/useGetEncryptionPreferences';

interface Props {
    model: ExportCalendarModel;
    setModel: Dispatch<SetStateAction<ExportCalendarModel>>;
    onFinish: (vevents: VcalVeventComponent[], erroredEvents: CalendarEvent[]) => void;
    addresses: Address[];
}
const ExportingModalContent = ({ model, setModel, onFinish, addresses }: Props) => {
    const api = useApi();
    const getAddressKeys = useGetAddressKeys();
    const getEncryptionPreferences = useGetEncryptionPreferences();
    const getCalendarKeys = useGetCalendarKeys();

    const { totalToProcess } = model;

    useBeforeUnload(c('Alert').t`By leaving now, some events may not be imported`);

    useEffect(() => {
        // Prepare api for allowing cancellation in the middle of the export
        const abortController = new AbortController();
        const { signal } = abortController;

        const apiWithAbort: <T>(config: object) => Promise<T> = (config) => api({ ...config, signal });

        const setModelWithAbort = (set: (model: ExportCalendarModel) => ExportCalendarModel) => {
            if (signal.aborted) {
                return;
            }
            setModel(set);
        };

        const handleExportProgress = (veventComponents: VcalVeventComponent[]) => {
            if (!veventComponents.length) {
                return;
            }

            setModelWithAbort((model) => ({
                ...model,
                totalProcessed: [...model.totalProcessed, ...veventComponents],
            }));
        };

        const process = async () => {
            try {
                const processData = {
                    calendarID: model.calendar.ID,
                    addresses,
                    api: apiWithAbort,
                    signal,
                    onProgress: handleExportProgress,
                    getAddressKeys,
                    getEncryptionPreferences,
                    getCalendarKeys,
                    totalToProcess,
                };
                const [exportedEvents, erroredEvents] = await processInBatches(processData);
                handleExportProgress([]);

                if (signal.aborted) {
                    return;
                }

                onFinish(exportedEvents, erroredEvents);
            } catch (error) {
                setModelWithAbort((model) => ({
                    step: EXPORT_STEPS.FINISHED,
                    calendar: model.calendar,
                    totalProcessed: [],
                    totalToProcess: 0,
                    erroredEvents: [],
                    error,
                }));

                if (signal.aborted) {
                    return;
                }

                onFinish([], []);
            }
        };

        process();

        return () => {
            abortController.abort();
        };
    }, []);

    const display =
        totalToProcess && !model.totalProcessed.length
            ? c('Export calendar').t`Loading events`
            : c('Export calendar').t`${model.totalProcessed.length} events out of ${totalToProcess}...`;

    return (
        <>
            <Alert>
                {c('Export calendar').t`Please don't close the tab before the exporting process is finished.`}
            </Alert>
            <DynamicProgress
                id="progress-export-calendar"
                value={model.totalProcessed.length}
                display={display}
                max={totalToProcess}
                loading
            />
        </>
    );
};

export default ExportingModalContent;
