import { processInBatches } from 'proton-shared/lib/calendar/export/export';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { c } from 'ttag';

import {
    EXPORT_ERRORS,
    EXPORT_STEPS,
    ExportCalendarModel,
    ExportError,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';

import { getEventsCount } from 'proton-shared/lib/api/calendars';
import { Alert, DynamicProgress } from '../../../components';
import useGetCalendarEventPersonal from '../../../hooks/useGetCalendarEventPersonal';
import {
    useGetCalendarInfo,
    useApi,
    useGetAddresses,
    useGetAddressKeys,
    useGetEncryptionPreferences,
    useGetCalendarKeys,
} from '../../../hooks';

interface Props {
    model: ExportCalendarModel;
    setModel: Dispatch<SetStateAction<ExportCalendarModel>>;
    onFinish: (vevents: VcalVeventComponent[], exportErrors: ExportError[]) => void;
}
const ExportingModalContent = ({ model, setModel, onFinish }: Props) => {
    const api = useApi();
    const getAddresses = useGetAddresses();
    const getAddressKeys = useGetAddressKeys();
    const getEncryptionPreferences = useGetEncryptionPreferences();
    const getCalendarInfo = useGetCalendarInfo();
    const getCalendarEventPersonal = useGetCalendarEventPersonal();
    const getCalendarKeys = useGetCalendarKeys();

    const { totalToProcess, totalProcessed } = model;

    useEffect(() => {
        // Prepare api for allowing cancellation in the middle of the export
        const abortController = new AbortController();
        const { signal } = abortController;

        const apiWithAbort: <T>(config: object) => Promise<T> = (config) => api({ ...config, signal });

        const setModelWithAbort = (set: (currentModel: ExportCalendarModel) => ExportCalendarModel) => {
            if (signal.aborted) {
                return;
            }
            setModel(set);
        };

        const handleExportProgress = (veventComponents: VcalVeventComponent[]) => {
            if (!veventComponents.length) {
                return;
            }

            setModelWithAbort((currentModel) => ({
                ...currentModel,
                totalProcessed: [...currentModel.totalProcessed, ...veventComponents],
            }));
        };

        const process = async () => {
            try {
                const addresses = await getAddresses();
                const { memberID } = await getCalendarInfo(model.calendar.ID);

                if (!addresses) {
                    throw new Error('No addresses');
                }

                const { Total: totalToProcess } = await api<{ Total: number }>(getEventsCount(model.calendar.ID));

                setModelWithAbort((currentModel) => ({
                    ...currentModel,
                    totalToProcess,
                }));

                const [exportedEvents, exportErrors, totalEventsFetched] = await processInBatches({
                    calendarID: model.calendar.ID,
                    addresses,
                    api: apiWithAbort,
                    signal,
                    onProgress: handleExportProgress,
                    getAddressKeys,
                    getEncryptionPreferences,
                    getCalendarKeys,
                    getCalendarEventPersonal,
                    memberID,
                    totalToProcess,
                    weekStartsOn: model.weekStartsOn,
                });

                if (totalToProcess !== totalEventsFetched) {
                    setModelWithAbort((currentModel) => ({
                        ...currentModel,
                        totalToProcess: totalEventsFetched,
                    }));
                }

                if (signal.aborted) {
                    return;
                }

                onFinish(exportedEvents, exportErrors);
            } catch (error) {
                setModelWithAbort((currentModel) => ({
                    step: EXPORT_STEPS.FINISHED,
                    calendar: currentModel.calendar,
                    totalProcessed: [],
                    totalToProcess: 0,
                    exportErrors: [],
                    error: EXPORT_ERRORS.NETWORK_ERROR,
                    weekStartsOn: model.weekStartsOn,
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
    const totalProcessedLength = totalProcessed.length;

    const display = !totalProcessedLength
        ? c('Export calendar').t`Loading events`
        : c('Export calendar').t`Decrypting events from your calendar: ${totalProcessedLength}/${totalToProcess}`;

    return (
        <>
            <Alert>
                {c('Export calendar').t`Please don't close the tab before the exporting process is finished.`}
            </Alert>
            <DynamicProgress
                id="progress-export-calendar"
                value={totalProcessedLength}
                display={display}
                max={totalToProcess}
                loading
            />
        </>
    );
};

export default ExportingModalContent;
