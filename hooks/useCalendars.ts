import { useCallback, useMemo } from 'react';
import {
    getDefaultCalendar,
    getIsCalendarDisabled,
    getProbablyActiveCalendars
} from 'proton-shared/lib/calendar/calendar';
import { Calendar } from 'proton-shared/lib/interfaces/calendar';
import { CalendarsModel } from 'proton-shared/lib/models/calendarsModel';

import useApi from '../containers/api/useApi';
import useCache from '../containers/cache/useCache';
import { useCalendarUserSettings } from '../index';
import useCachedModelResult, { getPromiseValue } from './useCachedModelResult';

export const useGetCalendars = () => {
    const api = useApi();
    const cache = useCache();
    const miss = useCallback(() => CalendarsModel.get(api), [api]);
    return useCallback(() => {
        return getPromiseValue(cache, CalendarsModel.key, miss);
    }, [cache, miss]);
};

export const useCalendars = (): [Calendar[] | undefined, boolean, any] => {
    const cache = useCache();
    const miss = useGetCalendars();
    return useCachedModelResult(cache, CalendarsModel.key, miss);
};

export const useUserCalendars = () => {
    const [calendars] = useCalendars();
    const [calendarUserSettings] = useCalendarUserSettings();

    const { activeCalendars, disabledCalendars, visibleCalendars } = useMemo(() => {
        if (!calendars) {
            return {};
        }

        return {
            calendars,
            activeCalendars: getProbablyActiveCalendars(calendars),
            disabledCalendars: calendars.filter((calendar) => getIsCalendarDisabled(calendar)),
            visibleCalendars: calendars.filter(({ Display }) => !!Display)
        };
    }, [calendars]);
    const defaultCalendar = getDefaultCalendar(activeCalendars, calendarUserSettings?.DefaultCalendarID);

    return { activeCalendars, disabledCalendars, visibleCalendars, defaultCalendar };
};
