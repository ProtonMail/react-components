import React, { useEffect, useState } from 'react';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname, resumeSession } from 'proton-shared/lib/authentication/helper';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/getApiErrorMessage';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { OnLoginCallback } from './interface';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { StandardLoadError, useApi, useNotifications } from '../../index';

interface Props {
    onLogin: OnLoginCallback;
    onInactiveSession: (localID?: number) => void;
}
const SSOPublicApp = ({ onLogin, onInactiveSession }: Props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useEffect(() => {
        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                return onInactiveSession(undefined);
            }
            await loadOpenPGP();
            try {
                const result = await resumeSession(silentApi, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError) {
                    // Persistent session inactive, redirect and re-fork
                    return onInactiveSession(localID);
                }
                throw e;
            }
        };
        run()
            .then(() => setLoading(false))
            .catch((e) => {
                const errorMessage = getApiErrorMessage(e) || 'Unknown error';
                createNotification({ type: 'error', text: errorMessage });
                console.error(error);
                setError(e);
            });
    }, []);

    if (error) {
        return <StandardLoadError />;
    }

    if (loading) {
        return (
            <>
                <LoaderPage />
                <ModalsChildren />
            </>
        );
    }

    return null;
};

export default SSOPublicApp;
