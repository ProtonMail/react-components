import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { c } from 'ttag';

import { EXPORT_STEPS, ExportCalendarModel, VcalVeventComponent } from 'proton-shared/lib/interfaces/calendar';
import { processInBatches } from 'proton-shared/lib/calendar/decryptEvents';

import { Address } from 'proton-shared/lib/interfaces';
import { Alert, DynamicProgress } from '../../../components';
import { useApi, useBeforeUnload, useGetAddressKeys, useGetCalendarKeys } from '../../../hooks';
import useGetEncryptionPreferences from '../../../hooks/useGetEncryptionPreferences';

interface Props {
    model: ExportCalendarModel;
    setModel: Dispatch<SetStateAction<ExportCalendarModel>>;
    onFinish: (vevents: VcalVeventComponent[]) => void;
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
        // Prepare api for allowing cancellation in the middle of the import
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
                const exportedEvents = await processInBatches(processData);
                handleExportProgress([]);

                if (signal.aborted) {
                    return;
                }

                onFinish(exportedEvents);
            } catch (error) {
                console.error('error: ', error);
                setModelWithAbort((model) => ({
                    step: EXPORT_STEPS.WARNING, // TODO: is it supposed to be WARNING?
                    calendar: model.calendar,
                    totalProcessed: [],
                    totalToProcess: 0,
                }));
                if (signal.aborted) {
                    return;
                }
                onFinish([]);
            }
        };

        process();

        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <>
            <Alert>
                {c('Export calendar').t`Please don't close the tab before the exporting process is finished.`}
            </Alert>
            <DynamicProgress
                id="progress-export-calendar"
                value={model.totalProcessed.length}
                display={c('Export calendar').t`${model.totalProcessed.length} events out of ${totalToProcess}...`}
                max={totalToProcess}
                loading
            />
        </>
    );
};

export default ExportingModalContent;
