import { useCallback } from 'react';
import getPublicKeysEmailHelper from 'proton-shared/lib/api/helpers/getPublicKeysEmailHelper';
import { MILLISECONDS_IN_MINUTE } from 'proton-shared/lib/date-fns-utc';
import useCache from './useCache';
import { getPromiseValue } from './useCachedModelResult';
import useApi from './useApi';

export const CACHE_KEY = 'PUBLIC_KEYS';

const PUBLIC_KEYS_LIFETIME = 5 * MILLISECONDS_IN_MINUTE;

export const useGetPublicKeys = () => {
    const cache = useCache();
    const api = useApi();

    return useCallback(
        (email) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            const miss = () => getPublicKeysEmailHelper(api, email, true);
            return getPromiseValue(subCache, email, miss, PUBLIC_KEYS_LIFETIME);
        },
        [api, cache]
    );
};

export default useGetPublicKeys;
