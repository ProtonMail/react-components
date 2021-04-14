import React, { useEffect } from 'react';
import { c } from 'ttag';

import { Calendar, EXPORT_STEPS, ExportCalendarModel } from 'proton-shared/lib/interfaces/calendar';
import { getEventsCount } from 'proton-shared/lib/api/calendars';
import { Address } from 'proton-shared/lib/interfaces';
import { useApi, useGetAddresses } from '../../../hooks';
import { Loader } from '../../../components';

interface Props {
    calendar: Calendar;
    setModel: React.Dispatch<React.SetStateAction<ExportCalendarModel>>;
    setAddresses: React.Dispatch<React.SetStateAction<Address[] | undefined>>;
}

const ExportModalFetchingDependenciesContent = ({ calendar, setModel, setAddresses }: Props) => {
    const api = useApi();
    const getAddresses = useGetAddresses();

    useEffect(() => {
        void (async () => {
            try {
                setModel((currentModel) => ({ ...currentModel, step: EXPORT_STEPS.FETCHING_DEPENDENCIES }));
                const addresses = await getAddresses();

                if (!addresses) {
                    throw new Error('No addresses');
                }

                setAddresses(addresses);

                const countResponse = await api<{ Total: number }>(getEventsCount(calendar.ID));

                setModel((currentModel) => ({
                    ...currentModel,
                    totalToProcess: countResponse.Total,
                    step: EXPORT_STEPS.EXPORTING,
                }));
            } catch (error) {
                setModel((currentModel) => ({ ...currentModel, step: EXPORT_STEPS.ERROR_FETCHING_DEPENDENCIES }));
            }
        })();
    }, []);

    return (
        <>
            <Loader />
            <p className="text-center">{c('Export modal').t`Loading dependencies`}</p>
        </>
    );
};

export default ExportModalFetchingDependenciesContent;
