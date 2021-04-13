import { useCallback } from 'react';
import getMemberAndAddress, { getMemberAndAddressID } from 'proton-shared/lib/calendar/integration/getMemberAndAddress';
import { DecryptedCalendarKey } from 'proton-shared/lib/interfaces/calendar';
import { DecryptedKey } from 'proton-shared/lib/interfaces';
import { useGetAddresses } from './useAddresses';
import { useGetAddressKeys } from './useGetAddressKeys';
import { useGetCalendarBootstrap } from './useGetCalendarBootstrap';
import { useGetCalendarKeys } from './useGetCalendarKeys';

export interface CalendarInfo {
    memberID: string;
    addressKeys: DecryptedKey[];
    calendarKeys: DecryptedCalendarKey[];
    calendarSettings: any;
}

export const useGetCalendarInfo = () => {
    const getCalendarBootstrap = useGetCalendarBootstrap();
    const getAddresses = useGetAddresses();
    const getCalendarKeys = useGetCalendarKeys();
    const getAddressKeys = useGetAddressKeys();

    return useCallback(
        async (calendarID: string): Promise<CalendarInfo> => {
            const [{ Members, CalendarSettings: calendarSettings }, Addresses] = await Promise.all([
                getCalendarBootstrap(calendarID),
                getAddresses(),
            ]);
            const [memberID, addressID] = getMemberAndAddressID(getMemberAndAddress(Addresses, Members));
            const [addressKeys, calendarKeys] = await Promise.all([
                getAddressKeys(addressID),
                getCalendarKeys(calendarID),
            ]);
            return { memberID, addressKeys, calendarKeys, calendarSettings };
        },
        [getCalendarBootstrap, getAddresses, getCalendarKeys, getAddressKeys]
    );
};
