import { useCallback } from 'react';
import { getFullCalendar } from 'proton-shared/lib/api/calendars';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';
import useApi from '../containers/api/useApi';

const useCalendarBootstrapAsync = () => {
    const cache = useCache();
    const api = useApi();

    const miss = useCallback((calendarID) => api(getFullCalendar(calendarID)), []);

    if (!cache.has('calendarBootstrap')) {
        cache.set('calendarBootstrap', new Map());
    }
    const calendarBootstrapCache = cache.get('calendarBootstrap');
    return useCachedModelAsync(calendarBootstrapCache, miss);
};

export default useCalendarBootstrapAsync;
