import { getDecryptedBlob, getPersistedSessionBlob } from 'proton-shared/lib/authentication/session';
import { InactiveSessionError } from 'proton-shared/lib/api/helpers/withApiHandlers';

export const getLocalID = (pathname: string) => {
    const maybeLocalID = pathname.match(/\/u(\d{0,6})\//);
    if (!maybeLocalID) {
        return;
    }
    const localID = parseInt(maybeLocalID[1], 10);
    if (!Number.isInteger(localID)) {
        return;
    }
    return localID;
};

export const getDecryptedPersistedSessionBlob = async (ClientKey: string, persistedSessionBlobString: string) => {
    const blob = await getDecryptedBlob(ClientKey, persistedSessionBlobString).catch(() => {
        throw InactiveSessionError();
    });
    const persistedSessionBlob = getPersistedSessionBlob(blob);
    if (!persistedSessionBlob) {
        throw InactiveSessionError();
    }
    return persistedSessionBlob;
};
