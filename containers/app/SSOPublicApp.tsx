import React, { useEffect, useState } from 'react';
import { PersistentSessionInvalid } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname, resumeSession } from 'proton-shared/lib/authentication/helper';
import { OnLoginCallback } from './interface';
import GenericError from '../error/GenericError';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { useApi } from '../../index';

interface Props {
    onLogin: OnLoginCallback;
}
const SSOPublicApp = ({ onLogin }: Props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const api = useApi();

    useEffect(() => {
        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                // No local ID in the url, redirect to the account switcher
                throw new Error('Handle redirect');
            }
            try {
                const result = await resumeSession(api, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof PersistentSessionInvalid) {
                    // Redirect to re-fork the session
                    throw new Error('Handle redirect');
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
