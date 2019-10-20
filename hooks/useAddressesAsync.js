import { useCallback } from 'react';
import { AddressesModel } from 'proton-shared/lib/models';
import useApi from '../containers/api/useApi';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';

const useAddressesAsync = () => {
    const api = useApi();
    const cache = useCache();
    const miss = useCallback(() => AddressesModel.get(api), []);
    return useCachedModelAsync(cache, miss, AddressesModel.key);
};

export default useAddressesAsync;
