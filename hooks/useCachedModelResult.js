import { useEffect, useState, useRef, useMemo } from 'react';
import { STATUS } from 'proton-shared/lib/models/cache';

const ERROR_IDX = 2;

export const getState = ({ value, status } = { status: STATUS.PENDING }, oldState = []) => {
    return [
        // The old state value is returned in case the model has been deleted from the cache
        status === STATUS.PENDING || status === STATUS.RESOLVED ? value || oldState[0] : undefined,
        status === STATUS.PENDING,
        status === STATUS.REJECTED ? value : undefined
    ];
};

const getRecordPending = (promise) => {
    return {
        status: STATUS.PENDING,
        value: undefined,
        promise
    };
};

const getRecordThen = (promise) => {
    return promise
        .then((value) => {
            return {
                status: STATUS.RESOLVED,
                value
            };
        })
        .catch((error) => {
            return {
                status: STATUS.REJECTED,
                value: error
            };
        });
};

/**
 * The strategy to re-fetch is:
 * 1) When no record exists for that key.
 * 2) If the old record has failed to fetch.
 * This should only happen when:
 * 1) When the component is initially mounted.
 * 2) A mounted component that receives an update from the cache that the key has been removed.
 * 3) A mounted component receives an update that the key has changed.
 * @param {Object} cache
 * @param {Object} key
 * @param {Promise} promise
 * @return {Object}
 */
const update = (cache, key, promise) => {
    const record = getRecordPending(promise);
    cache.set(key, record);
    getRecordThen(promise).then((newRecord) => cache.get(key) === record && cache.set(key, newRecord));
    return record;
};

export const getPromiseValue = (cache, key, miss) => {
    const oldRecord = cache.get(key);
    if (!oldRecord || oldRecord.status === STATUS.REJECTED) {
        const record = update(cache, key, miss(key));
        return record.promise;
    }
    return oldRecord.promise || Promise.resolve(oldRecord.value);
};

/**
 * Generic hook to be able to force a refresh on the component.
 * It will prevent errors if you try to force resfresh on an unmounted component.
 * @return [
 *  ref: a reference which will change at each forced refresh,
 *  refresh: a function to use to trigger a forced refresh
 * ]
 */
export const useForceRefresh = () => {
    // Artificial state to change to force refresh
    const [forceRefresh, setForceRefresh] = useState();

    // Component mounting flag
    const isMounted = useRef(true);

    // Detect component unmounting
    useEffect(() => () => (isMounted.current = false), []);

    return [
        // Force refresh ref
        forceRefresh,
        // Force refresh function
        () => {
            if (isMounted.current) {
                setForceRefresh({});
            }
        }
    ];
};

/**
 * Caches a model globally in the cache. Can be updated from the event manager.
 * @param {Map} cache
 * @param {String} key
 * @param {Function} miss - Returning a promise
 * @return {[value, loading, error]}
 */
const useCachedModelResult = (cache, key, miss) => {
    const [forceRefreshRef, forceRefresh] = useForceRefresh();

    const latestValue = useRef();

    const result = useMemo(() => {
        const oldRecord = cache.get(key);
        // If no record, or it's the first time loading this hook and the promise was previously rejected, retry the fetch strategy.
        if (!oldRecord || (!latestValue.current && oldRecord.status === STATUS.REJECTED)) {
            return getState(update(cache, key, miss(key)), latestValue.current);
        }
        return getState(oldRecord, latestValue.current);
    }, [cache, key, miss, forceRefreshRef]);

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
        latestValue.current = result;
    });

    useEffect(() => {
        const checkForChange = () => {
            const oldRecord = cache.get(key);
            if (!oldRecord) {
                return forceRefresh();
            }
            const newValue = getState(oldRecord, latestValue.current);
            if (newValue.some((value, i) => value !== latestValue.current[i])) {
                forceRefresh();
            }
        };
        const cacheListener = (changedKey) => {
            if (changedKey !== key) {
                return;
            }
            setTimeout(checkForChange);
        };
        checkForChange();
        return cache.subscribe(cacheListener);
    }, [cache, key, miss]);

    // Throw in render to allow the error boundary to catch it
    if (result[ERROR_IDX]) {
        throw result[ERROR_IDX];
    }

    return result;
};

export default useCachedModelResult;
