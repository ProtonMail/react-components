import React, { useEffect, useState } from 'react';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname, resumeSession } from 'proton-shared/lib/authentication/helper';
import { requestFork } from 'proton-shared/lib/authentication/forking';
import { OnLoginCallback } from './interface';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { useApi, useConfig } from '../../index';
import CollapsableError from '../error/CollapsableError';

interface Props {
    onLogin: OnLoginCallback;
}
const SSOPublicApp = ({ onLogin }: Props) => {
    const { APP_NAME } = useConfig();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const api = useApi();

    useEffect(() => {
        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                // No local ID in the url, redirect to the account switcher
                return requestFork(APP_NAME, undefined);
            }
            try {
                const result = await resumeSession(api, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError) {
                    // Persistent session not active anymore, redirect and re-fork
                    return requestFork(APP_NAME, localID);
                }
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
        return <LoaderPage />;
    }

    return <ModalsChildren />;
};

export default SSOPublicApp;
