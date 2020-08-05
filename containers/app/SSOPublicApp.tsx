import React, { useEffect, useState } from 'react';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname, resumeSession } from 'proton-shared/lib/authentication/helper';
import { requestFork } from 'proton-shared/lib/authentication/forking';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/getApiErrorMessage';
import { OnLoginCallback } from './interface';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { useApi, useConfig, useNotifications } from '../../index';
import CollapsableError from '../error/CollapsableError';

interface Props {
    onLogin: OnLoginCallback;
}
const SSOPublicApp = ({ onLogin }: Props) => {
    const { APP_NAME } = useConfig();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useEffect(() => {
        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                // No local ID in the url, redirect to the account switcher
                return requestFork(APP_NAME, undefined);
            }
            try {
                const result = await resumeSession(silentApi, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError) {
                    // Persistent session not active anymore, redirect and re-fork
                    return requestFork(APP_NAME, localID);
                }
                const errorMessage = getApiErrorMessage(e) || 'Unknown error';
                createNotification({ type: 'error', text: errorMessage });
                console.error(error);
                throw e;
            }
        };
        run()
            .then(() => setLoading(false))
            .catch((e) => setError(e));
    }, []);

    if (error) {
        return <CollapsableError error={error} />;
    }

    if (loading) {
        return (
            <>
                <LoaderPage />
                <ModalsChildren />
            </>
        );
    }
};

export default SSOPublicApp;
