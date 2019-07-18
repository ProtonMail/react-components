import { useEffect, useCallback } from 'react';

import useAsync from './useAsync';
import useApi from '../containers/api/useApi';

const useApiResult = (fn, dependencies) => {
    const request = useApi();
    const { loading, result, error, run } = useAsync(true);

    // Either user specified dependencies or empty array to always cancel requests on unmount.
    const hookDependencies = dependencies || [];

    // Callback updates
    const requestAndSetResults = useCallback(
        (...args) => {
            const promise = request(fn(...args));
            run(promise);
            return promise;
        },
        [request, run, fn]
    );

    useEffect(() => {
        // If user has specified any dependencies, auto request
        if (dependencies) {
            requestAndSetResults().catch(() => {
                // catch the error to stop the "uncaught exception error"
            });
        }
    }, [...hookDependencies]);

    return {
        result,
        error,
        loading,
        request: requestAndSetResults
    };
};

export default useApiResult;
