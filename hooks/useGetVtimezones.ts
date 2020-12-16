import { getVtimezones } from 'proton-shared/lib/api/calendars';
import { parse } from 'proton-shared/lib/calendar/vcal';
import { unique } from 'proton-shared/lib/helpers/array';
import { VcalVtimezoneComponent } from 'proton-shared/lib/interfaces/calendar';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { useCallback } from 'react';
import useApi from './useApi';
import useCache from './useCache';
import { getPromiseObjectValue } from './useCachedModelResult';

const CACHE_KEY = 'VTIMEZONES';

export interface VTimezoneObject {
    vtimezone: VcalVtimezoneComponent;
    vtimezoneString: string;
}

export type GetVTimezones = (tzids: string[]) => Promise<SimpleMap<VTimezoneObject>>;

export const useGetVTimezones = () => {
    const api = useApi();
    const cache = useCache();

    const getVTimezones = useCallback(
        async (tzids: string[]) => {
            const uniqueTzids = unique(tzids.filter((tzid) => tzid.toLowerCase() !== 'utc'));
            const encodedTzids = uniqueTzids.map((tzid) => encodeURIComponent(tzid));
            if (!uniqueTzids.length) {
                return Promise.resolve({});
            }
            const { Timezones = {} } = await api<{ Timezones: SimpleMap<string> }>(getVtimezones(encodedTzids));
            return tzids.reduce<SimpleMap<VTimezoneObject>>((acc, tzid) => {
                const vtimezoneString = Timezones[tzid];
                if (vtimezoneString) {
                    acc[tzid] = {
                        vtimezoneString,
                        vtimezone: parse(vtimezoneString) as VcalVtimezoneComponent,
                    };
                }
                return acc;
            }, {});
        },
        [api, cache]
    );

    return useCallback<GetVTimezones>(
        (tzids: string[]) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            const miss = () => getVTimezones(tzids);
            return getPromiseObjectValue(subCache, tzids, miss);
        },
        [cache, getVTimezones]
    );
};
