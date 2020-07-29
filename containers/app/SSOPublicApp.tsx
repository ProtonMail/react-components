import React, { useEffect, useState } from 'react';
import { getPersistedSession } from 'proton-shared/lib/authentication/session';
import { LocalKeyResponse } from 'proton-shared/lib/authentication/interface';
import { getLocalKey } from 'proton-shared/lib/api/auth';
import { withUIDHeaders } from 'proton-shared/lib/fetch/headers';
import { getUser } from 'proton-shared/lib/api/user';
import { OnLoginCallback } from './interface';
import GenericError from '../error/GenericError';
import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { getDecryptedPersistedSessionBlob, getLocalID } from './authHelper';
import { User as tsUser } from 'proton-shared/lib/interfaces';
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
            const localID = getLocalID(window.location.pathname);
            // No local ID in the url, redirect to the account switcher
            if (localID === undefined) {
                return;
            }
            const persistedSession = getPersistedSession(localID);
            const persistedUID = persistedSession?.UID;
            // Persistent session is invalid, redirect to re-fork this session
            if (!persistedSession || !persistedUID) {
                return;
            }
            // Persistent session to be validated
            const persistedSessionBlobString = persistedSession.blob;
            // User with password
            if (persistedSessionBlobString) {
                const { ClientKey } = await api<LocalKeyResponse>(withUIDHeaders(persistedUID, getLocalKey()));
                const { keyPassword } = await getDecryptedPersistedSessionBlob(ClientKey, persistedSessionBlobString);
                return onLogin({ UID: persistedUID, LocalID: localID, keyPassword });
            }
            // User without password
            const { User } = await api<{ User: tsUser }>(withUIDHeaders(persistedUID, getUser()));
            return onLogin({ UID: persistedUID, LocalID: localID, User });
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
