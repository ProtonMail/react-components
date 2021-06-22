import { CalendarCreateData } from 'proton-shared/lib/interfaces/calendar/Api';
import { CalendarSettings, CalendarWithPossibleSubscriptionParameters } from 'proton-shared/lib/interfaces/calendar';
import { getPrimaryKey } from 'proton-shared/lib/keys';
import { c } from 'ttag';
import {
    createCalendar,
    updateCalendar,
    updateCalendarSettings,
    updateCalendarUserSettings,
} from 'proton-shared/lib/api/calendars';
import { loadModels } from 'proton-shared/lib/models/helper';
import { CalendarsModel } from 'proton-shared/lib/models';
import { setupCalendarKey } from '../../keys/calendar';
import {
    useApi,
    useCache,
    useEventManager,
    useGetAddresses,
    useGetAddressKeys,
    useNotifications,
} from '../../../hooks';
import { useCalendarModelEventManager } from '../../eventManager';

interface Props {
    calendar?: CalendarWithPossibleSubscriptionParameters;
    setCalendar: React.Dispatch<React.SetStateAction<CalendarWithPossibleSubscriptionParameters | undefined>>;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    defaultCalendarID?: string;
    onClose?: () => void;
    activeCalendars?: CalendarWithPossibleSubscriptionParameters[];
    isOtherCalendar?: boolean;
}

const useGetCalendarActions = ({
    calendar: initialCalendar,
    setCalendar,
    setError,
    defaultCalendarID,
    onClose,
    activeCalendars,
    isOtherCalendar = false,
}: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { call: calendarCall } = useCalendarModelEventManager();
    const cache = useCache();
    const getAddresses = useGetAddresses();
    const getAddressKeys = useGetAddressKeys();
    const { createNotification } = useNotifications();

    const handleCreateCalendar = async (
        addressID: string,
        calendarPayload: CalendarCreateData,
        calendarSettingsPayload: Partial<CalendarSettings>
    ) => {
        const [addresses, addressKeys] = await Promise.all([getAddresses(), getAddressKeys(addressID)]);

        const { privateKey: primaryAddressKey } = getPrimaryKey(addressKeys) || {};
        if (!primaryAddressKey) {
            createNotification({ text: c('Error').t`Primary address key is not decrypted.`, type: 'error' });
            setError(true);
            throw new Error('Missing primary key');
        }

        const {
            Calendar,
            Calendar: { ID: newCalendarID },
        } = await api<{ Calendar: CalendarWithPossibleSubscriptionParameters }>(
            createCalendar({
                ...calendarPayload,
                AddressID: addressID,
            })
        );

        await setupCalendarKey({
            api,
            calendarID: newCalendarID,
            addresses,
            getAddressKeys,
        }).catch((e: Error) => {
            // Hard failure if the keys fail to setup. Force the user to reload.
            setError(true);
            throw e;
        });

        // Set the calendar in case one of the following calls fails so that it ends up in the update function after this.
        setCalendar(Calendar);

        if (!isOtherCalendar) {
            await Promise.all([
                api(updateCalendarSettings(newCalendarID, calendarSettingsPayload)),
                (() => {
                    if (defaultCalendarID) {
                        return;
                    }
                    const newDefaultCalendarID = activeCalendars?.length ? activeCalendars[0].ID : newCalendarID;
                    return api(updateCalendarUserSettings({ DefaultCalendarID: newDefaultCalendarID }));
                })(),
            ]);
        }

        // Refresh the calendar model in order to ensure flags are correct
        await loadModels([CalendarsModel], { api, cache, useCache: false });
        await call();

        onClose?.();

        createNotification({ text: c('Success').t`Calendar created` });
    };

    const handleUpdateCalendar = async (
        calendar: CalendarWithPossibleSubscriptionParameters,
        calendarPayload: Partial<CalendarWithPossibleSubscriptionParameters>,
        calendarSettingsPayload: Partial<CalendarSettings>
    ) => {
        const calendarID = calendar.ID;
        await Promise.all([
            api(updateCalendar(calendarID, calendarPayload)),
            api(updateCalendarSettings(calendarID, calendarSettingsPayload)),
        ]);
        // Case: Calendar has been created, and keys have been setup, but one of the calendar settings call failed in the creation.
        // Here we are in create -> edit mode. So we have to fetch the calendar model again.
        if (!initialCalendar) {
            await loadModels([CalendarsModel], { api, cache, useCache: false });
        }
        await call();
        await calendarCall([calendarID]);

        onClose?.();

        createNotification({ text: c('Success').t`Calendar updated` });
    };

    return { handleCreateCalendar, handleUpdateCalendar };
};

export default useGetCalendarActions;
