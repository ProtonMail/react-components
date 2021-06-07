import { useCallback } from 'react';

import { CalendarSubscription } from 'proton-shared/lib/interfaces/calendar';
import { getSubscriptionParameters } from 'proton-shared/lib/api/calendars';
import createCache from 'proton-shared/lib/helpers/cache';

import { getPromiseValue } from '../../../hooks/useCachedModelResult';
import { useApi, useCache } from '../../../hooks';

export const KEY = 'CALENDAR_SUBSCRIPTION';

export const useGetCalendarSubscription = () => {
    const api = useApi();
    const cache = useCache();
    const miss = useCallback(
        (calendarID: string) => {
            if (!calendarID) {
                return Promise.resolve();
            }
            return api<CalendarSubscription>(getSubscriptionParameters(calendarID));
        },
        [api]
    );

    return useCallback(
        (calendarID: string) => {
            if (!cache.has(KEY)) {
                cache.set(KEY, createCache());
            }
            return getPromiseValue(cache.get(KEY), calendarID, miss);
        },
        [cache, miss]
    );
};
