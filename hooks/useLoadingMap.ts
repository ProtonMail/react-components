import { useRef, useState, useEffect, useCallback } from 'react';
import { LoadingMap } from '../../proton-mail/src/app/models/utils';

type WithLoadingMap = (promiseMap: { [key: string]: Promise<any | void> }) => Promise<any | void>;
type NumberMap = { [key: string]: number };

const useLoadingMap = (initialState = {}): [LoadingMap, WithLoadingMap] => {
    const [loadingMap, setLoadingMap] = useState<LoadingMap>(initialState);
    const unmountedRef = useRef(false);
    const counterMapRef = useRef<NumberMap>({});

    useEffect(() => {
        return () => {
            unmountedRef.current = true;
        };
    }, []);

    const withLoadingMap = useCallback<WithLoadingMap>((promiseMap) => {
        if (!promiseMap) {
            setLoadingMap({});
            return Promise.resolve();
        }
        const counterMapNext = Object.keys(promiseMap).reduce<NumberMap>((acc, key) => {
            const currentCounter = acc[key] || 0;
            acc[key] = currentCounter + 1;
            return acc;
        }, {});
        counterMapRef.current = counterMapNext;
        const initialMap = Object.fromEntries(Object.keys(promiseMap).map((key) => [key, true]));
        setLoadingMap(initialMap);
        return Promise.all(
            Object.entries(promiseMap).map(([key, promise]) => {
                return promise
                    .then((result) => {
                        // Ensure that the latest promise is setting the new state
                        if (counterMapRef.current[key] !== counterMapNext[key]) {
                            return;
                        }
                        !unmountedRef.current &&
                            setLoadingMap((loadingMap) => ({
                                ...loadingMap,
                                [key]: false,
                            }));
                        return result;
                    })
                    .catch((e) => {
                        if (counterMapRef.current[key] !== counterMapNext[key]) {
                            return;
                        }
                        !unmountedRef.current &&
                            setLoadingMap((loadingMap) => ({
                                ...loadingMap,
                                [key]: false,
                            }));
                        throw e;
                    });
            })
        );
    }, []);

    return [loadingMap, withLoadingMap];
};

export default useLoadingMap;
