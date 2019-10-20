import { useCallback } from 'react';
import { getPublicKeysEmailHelper } from 'proton-shared/lib/api/helpers/publicKeys';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';
import useApi from '../containers/api/useApi';

const usePublicKeysAsync = () => {
    const cache = useCache();
    const api = useApi();

    const miss = useCallback(async (email) => {
        return getPublicKeysEmailHelper(api, email);
    }, []);

    if (!cache.has('publicKeys')) {
        cache.set('publicKeys', new Map());
    }
    const publicKeysCache = cache.get('publicKeys');
    return useCachedModelAsync(publicKeysCache, miss);
};

export default usePublicKeysAsync;
