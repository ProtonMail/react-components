import { useEffect, useState } from 'react';
import { c } from 'ttag';

import { getActiveAddresses } from 'proton-shared/lib/helpers/address';
import { Calendar, CalendarViewModelFull, SubscribedCalendar } from 'proton-shared/lib/interfaces/calendar';

import { UserModel } from 'proton-shared/lib/interfaces';
import { getCalendarModel } from '../calendarModal/calendarModalState';
import { useGetAddresses, useGetCalendarBootstrap, useLoading, useNotifications, useUser } from '../../../hooks';

interface Props {
    calendar?: Calendar | SubscribedCalendar;
    setModel: React.Dispatch<React.SetStateAction<CalendarViewModelFull>>;
}

const useGetCalendarSetup = ({ calendar: initialCalendar, setModel }: Props) => {
    const getAddresses = useGetAddresses();
    const getCalendarBootstrap = useGetCalendarBootstrap();
    const user = useUser() as never as UserModel;

    const [loading, withLoading] = useLoading(true);
    const { createNotification } = useNotifications();

    const [error, setError] = useState(false);

    useEffect(() => {
        const initializeEmptyCalendar = async () => {
            const activeAdresses = getActiveAddresses(await getAddresses());
            if (!activeAdresses.length) {
                setError(true);
                return createNotification({ text: c('Error').t`No valid address found`, type: 'error' });
            }

            const filteredActive = activeAdresses.filter(
                ({ Email }) => !(!user.hasPaidMail && /@pm\..+$/i.test(Email))
            );

            setModel((prev) => ({
                ...prev,
                addressID: filteredActive[0].ID,
                addressOptions: filteredActive.map(({ ID, Email = '' }) => ({ value: ID, text: Email })),
            }));
        };

        const initializeCalendar = async () => {
            if (!initialCalendar) {
                throw new Error('No initial calendar');
            }

            const [{ Members, CalendarSettings }, Addresses] = await Promise.all([
                getCalendarBootstrap(initialCalendar.ID),
                getAddresses(),
            ]);

            const [{ Email: memberEmail } = { Email: '' }] = Members;
            const { ID: AddressID } = Addresses.find(({ Email }) => memberEmail === Email) || {};

            if (!AddressID) {
                setError(true);
                return createNotification({ text: c('Error').t`No valid address found`, type: 'error' });
            }

            setModel((prev) => ({
                ...prev,
                ...getCalendarModel({ Calendar: initialCalendar, CalendarSettings, Addresses, AddressID }),
            }));
        };

        const promise = initialCalendar ? initializeCalendar() : initializeEmptyCalendar();

        void withLoading(
            promise.catch(() => {
                setError(true);
            })
        );
    }, []);

    return { loading, error };
};

export default useGetCalendarSetup;
