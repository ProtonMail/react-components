import { useCallback, useEffect, useRef } from 'react';

const useDebounceCallback = <T extends any[]>(cb: (...args: T) => void, wait: number) => {
    const callbackRef = useRef(cb);
    const timeout = useRef<ReturnType<typeof window.setTimeout>>();
    useEffect(() => {
        callbackRef.current = cb;
    });
    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            timeout.current = undefined;
        };
    }, [wait]);
    return useCallback(
        function handleDebounce() {
            // eslint-disable-next-line prefer-rest-params
            const args = arguments;
            const { current } = timeout;
            if (current) {
                window.clearTimeout(current);
            }
            timeout.current = setTimeout(() => {
                timeout.current = undefined;
                callbackRef.current.apply(null, args as any);
            }, wait);
        },
        [wait]
    );
};

export default useDebounceCallback;
