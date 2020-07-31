import {
    getDecryptedBlob,
    getPersistedSession,
    getPersistedSessionBlob
} from 'proton-shared/lib/authentication/session';
import { FORKABLE_APPS } from 'proton-shared/lib/authentication/constants';
import { APPS } from 'proton-shared/lib/constants';
import { Api, User as tsUser } from 'proton-shared/lib/interfaces';
import { LocalKeyResponse } from 'proton-shared/lib/authentication/interface';
import { withUIDHeaders } from 'proton-shared/lib/fetch/headers';
import { getLocalKey } from 'proton-shared/lib/api/auth';
import { getUser } from 'proton-shared/lib/api/user';
import { PersistentSessionInvalid } from 'proton-shared/lib/authentication/error';

export const getValidatedApp = (app = ''): APPS | undefined => {
    if (app in FORKABLE_APPS) {
        return FORKABLE_APPS[app as keyof typeof FORKABLE_APPS];
    }
}

export const getValidatedLocalID = (localID = '') => {
    if (!localID) {
        return;
    }
    const maybeLocalID = parseInt(localID, 10);
    if (Number.isInteger(maybeLocalID) && maybeLocalID >= 0 && maybeLocalID <= 100000000) {
        return maybeLocalID;
    }
}

export const getLocalIDFromPathname = (pathname: string) => {
    const maybeLocalID = pathname.match(/\/u(\d{0,6})\//);
    return getValidatedLocalID(maybeLocalID?.[1]);
};

export const getDecryptedPersistedSessionBlob = async (ClientKey: string, persistedSessionBlobString: string) => {
    const blob = await getDecryptedBlob(ClientKey, persistedSessionBlobString).catch(() => {
        throw new PersistentSessionInvalid();
    });
    const persistedSessionBlob = getPersistedSessionBlob(blob);
    if (!persistedSessionBlob) {
        throw new PersistentSessionInvalid();
    }
    return persistedSessionBlob;
};

export const resumeSession = async (api: Api, localID: number) => {
    const persistedSession = getPersistedSession(localID);
    const persistedUID = persistedSession?.UID;

    // Persistent session is invalid, redirect to re-fork this session
    if (!persistedSession || !persistedUID) {
        throw new PersistentSessionInvalid();
    }

    // Persistent session to be validated
    const persistedSessionBlobString = persistedSession.blob;

    // User with password
    if (persistedSessionBlobString) {
        try {
            const { ClientKey } = await api<LocalKeyResponse>(withUIDHeaders(persistedUID, getLocalKey()));
            const { keyPassword } = await getDecryptedPersistedSessionBlob(ClientKey, persistedSessionBlobString);
            return { UID: persistedUID, LocalID: localID, keyPassword };
        } catch (e) {
            if (e.name === 'InvalidSession') {
                throw new PersistentSessionInvalid();
            }
            throw e;
        }
    }

    try {
        // User without password
        const { User } = await api<{ User: tsUser }>(withUIDHeaders(persistedUID, getUser()));
        return { UID: persistedUID, LocalID: localID, User };
    } catch (e) {
        if (e.name === 'InvalidSession') {
            throw new PersistentSessionInvalid();
        }
        throw e;
    }
}
