import React, { useEffect, useState } from 'react';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname, resumeSession } from 'proton-shared/lib/authentication/helper';
import { replaceUrl } from 'proton-shared/lib/helpers/browser';
import { getAppHref } from 'proton-shared/lib/apps/helper';
import { APPS } from 'proton-shared/lib/constants';
import { OnLoginCallback } from './interface';
import GenericError from '../error/GenericError';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { useApi, useConfig } from '../../index';

interface Props {
    onLogin: OnLoginCallback;
}
const SSOPublicApp = ({ onLogin }: Props) => {
    const { APP_NAME } = useConfig();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const api = useApi();

    useEffect(() => {
        const forkAndRedirect = (localID?: number) => {
            const searchParams = new URLSearchParams();
            searchParams.append('app', APP_NAME);
            searchParams.append('state', state);
            if (localID !== undefined) {
                searchParams.append('u', `${localID}`);
            }

            const hashParams = new URLSearchParams();
            hashParams.append('sk', sessionKey);

            return replaceUrl(getAppHref(`/authorize?${searchParams.toString()}#${hashParams.toString()}`, APPS.PROTONACCOUNT));
        }

        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                // No local ID in the url, redirect to the account switcher
                return forkAndRedirect(undefined);
            }
            try {
                const result = await resumeSession(api, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError) {
                    // Persistent session not active anymore, redirect and re-fork
                    return forkAndRedirect(localID);
                }
                throw e;
            }
        };
        run()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <GenericError />;
    }

    if (loading) {
        return <LoaderPage />;
    }

    return <ModalsChildren />;
};

export default SSOPublicApp;
