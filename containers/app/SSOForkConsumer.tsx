import React, { useEffect, useState } from 'react';
import { InvalidForkConsumeError } from 'proton-shared/lib/authentication/error';
import { consumeFork, getConsumeForkParameters } from 'proton-shared/lib/authentication/sessionForking';

import { useApi, useErrorHandler } from '../../hooks';
import { ProtonLoginCallback } from './interface';
import StandardLoadErrorPage from './StandardLoadErrorPage';
import { ModalsChildren } from '../modals';
import LoaderPage from './LoaderPage';

interface Props {
    onLogin: ProtonLoginCallback;
    onEmptyFork: () => void;
    onInvalidFork: () => void;
}

const SSOForkConsumer = ({ onLogin, onEmptyFork, onInvalidFork }: Props) => {
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const errorHandler = useErrorHandler();

    useEffect(() => {
        const run = async () => {
            const { state, selector, key, type } = getConsumeForkParameters();
            if (!state && !selector && !key) {
                return onEmptyFork();
            }
            if (!state || !selector || !key) {
                return onInvalidFork();
            }
            try {
                const result = await consumeFork({ selector, api: silentApi, state, key, type });
                onLogin(result);
                return;
            } catch (e) {
                if (e instanceof InvalidForkConsumeError) {
                    return onInvalidFork();
                }
                throw e;
            }
        };

        run().catch((e) => {
            errorHandler(e);
            setError(e);
        });
    }, []);

    if (error) {
        return <StandardLoadErrorPage />;
    }

    return (
        <>
            <LoaderPage />
            <ModalsChildren />
        </>
    );
};

export default SSOForkConsumer;
