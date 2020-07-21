import { AuthenticationStore } from 'proton-shared/lib/authenticationStore';
import { getPersistedSession } from 'proton-shared/lib/authentication/session';

export const getLocalID = (pathname: string) => {
    const maybeLocalID = pathname.match(/\/\d{0,6}\//);
    if (!maybeLocalID) {
        return;
    }
    const localID = parseInt(maybeLocalID[1], 10);
    if (!Number.isInteger(localID)) {
        return;
    }
    return localID;
};

export const getInitialUID = (authentication: AuthenticationStore) => {
    const uid = authentication.getUID();
    if (uid) {
        return uid;
    }
    const localID = getLocalID(window.location.pathname);
    if (localID === undefined) {
        return;
    }
    const persistedSession = getPersistedSession(localID);
    if (!persistedSession?.UID) {
        return;
    }
    authentication.setLocalID(localID);
    return persistedSession.UID;
};
