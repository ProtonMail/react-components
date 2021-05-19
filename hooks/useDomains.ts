import { useCallback } from 'react';
import { DomainsModel } from 'proton-shared/lib/models/domainsModel';
import { Domain } from 'proton-shared/lib/interfaces';
import useApi from './useApi';
import useCache from './useCache';
import useCachedModelResult, { getPromiseValue } from './useCachedModelResult';

export const useGetDomains = (): (() => Promise<Domain[]>) => {
    const api = useApi();
    const cache = useCache();
    const miss = useCallback(() => DomainsModel.get(api), [api]);
    return useCallback(() => {
        return getPromiseValue(cache, DomainsModel.key, miss);
    }, [cache, miss]);
};

export const useDomains = (): [Domain[], boolean, any] => {
    const cache = useCache();
    const miss = useGetDomains();
    return useCachedModelResult(cache, DomainsModel.key, miss);
};

export default useDomains;
