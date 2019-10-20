import { useCallback } from 'react';
import { UserModel } from 'proton-shared/lib/models';

import useApi from '../containers/api/useApi';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';

const useUserAsync = () => {
    const api = useApi();
    const cache = useCache();
    const miss = useCallback(() => UserModel.get(api), []);
    return useCachedModelAsync(cache, miss, UserModel.key);
};

export default useUserAsync;
