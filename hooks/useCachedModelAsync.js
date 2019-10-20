import { useCallback } from 'react';

import { update } from './useCachedModelResult';

const useCachedModelAsync = (cache, miss, defaultKey) => {
    return useCallback(
        (key = defaultKey) => {
            const record = update(cache, key, miss);
            return record.promise || record.value;
        },
        [cache, miss]
    );
};

export default useCachedModelAsync;
