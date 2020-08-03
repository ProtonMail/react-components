import React, { useState, useCallback, useRef, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import createAuthentication from 'proton-shared/lib/authentication/createAuthenticationStore';
import createCache, { Cache } from 'proton-shared/lib/helpers/cache';
import { formatUser, UserModel } from 'proton-shared/lib/models/userModel';
import { STATUS } from 'proton-shared/lib/models/cache';
import createSecureSessionStorage from 'proton-shared/lib/authentication/createSecureSessionStorage';
import createSecureSessionStorage2 from 'proton-shared/lib/authentication/createSecureSessionStorage2';
import { isSSOMode, MAILBOX_PASSWORD_KEY, UID_KEY } from 'proton-shared/lib/constants';
import { getPersistedSession } from 'proton-shared/lib/authentication/session';

import CompatibilityCheck from './CompatibilityCheck';
import Icons from '../../components/icon/Icons';
import ConfigProvider from '../config/Provider';
import NotificationsProvider from '../notifications/Provider';
import ModalsProvider from '../modals/Provider';
import ApiProvider from '../api/ApiProvider';
import CacheProvider from '../cache/Provider';
import AuthenticationProvider from '../authentication/Provider';
import RightToLeftProvider from '../rightToLeft/Provider';
import { setTmpEventID } from './loadEventID';
import clearKeyCache from './clearKeyCache';
import useInstance from '../../hooks/useInstance';
import { PreventLeaveProvider } from '../../hooks/usePreventLeave';
import { getLocalIDFromPathname } from './authHelper';

interface Props {
    config: any;
    children: React.ReactNode;
}
const ProtonApp = ({ config, children }: Props) => {
    const authentication = useInstance(() => {
        if (isSSOMode) {
            return createAuthentication(createSecureSessionStorage2());
        }
        return createAuthentication(createSecureSessionStorage([MAILBOX_PASSWORD_KEY, UID_KEY]));
    });
    const cacheRef = useRef<Cache<string, any>>();
    if (!cacheRef.current) {
        cacheRef.current = createCache<string, any>();
    }
    const [UID, setUID] = useState(() => {
        const UID = authentication.getUID();
        if (!isSSOMode) {
            return UID;
        }
        const localID = getLocalIDFromPathname(window.location.pathname);
        if (localID === undefined) {
            return;
        }
        const oldLocalId = authentication.getLocalID();
        // Current session is active and actual
        if (UID && localID === oldLocalId) {
            return UID;
        }
        const persistedSession = getPersistedSession(localID);
        const persistedUID = persistedSession?.UID;
        // Persistent session is invalid
        if (!persistedSession || !persistedUID) {
            return;
        }
        // Persistent session to be validated
        authentication.setUID(persistedUID);
        authentication.setTmpPersistedSession(persistedSession);
        authentication.setLocalID(localID);
        return persistedUID;
    });

    const handleLogin = useCallback(({ UID: newUID, EventID, keyPassword, User, LocalID: newLocalID }) => {
        authentication.setUID(newUID);
        authentication.setPassword(keyPassword);
        authentication.setLocalID(newLocalID);

        const oldCache = cacheRef.current;
        if (oldCache) {
            oldCache.clear();
            oldCache.clearListeners();
        }
        const cache = createCache<string, any>();

        // If the user was received from the login call, pre-set it directly.
        User &&
            cache.set(UserModel.key, {
                value: formatUser(User),
                status: STATUS.RESOLVED,
            });

        setTmpEventID(cache, EventID);

        cacheRef.current = cache;

        setUID(newUID);
    }, []);

    const handleLogout = useCallback(() => {
        authentication.setUID(undefined);
        authentication.setPassword(undefined);

        const oldCache = cacheRef.current;
        if (oldCache) {
            clearKeyCache(oldCache);
            oldCache.clear();
            oldCache.clearListeners();
        }

        cacheRef.current = createCache<string, any>();

        setUID(undefined);
    }, []);

    const authenticationValue = useMemo(() => {
        if (!UID) {
            return {
                login: handleLogin,
            };
        }
        return {
            UID,
            ...authentication,
            logout: handleLogout,
        };
    }, [UID]);

    const basename = useMemo(() => {
        if (!isSSOMode) {
            return;
        }
        const localID = authentication.getLocalID();
        return UID && localID !== undefined ? `u${localID}` : '';
    }, [UID]);

    return (
        <ConfigProvider config={config}>
            <CompatibilityCheck>
                <Icons />
                <RightToLeftProvider>
                    <React.Fragment key={UID}>
                        <Router basename={basename}>
                            <PreventLeaveProvider>
                                <NotificationsProvider>
                                    <ModalsProvider>
                                        <ApiProvider UID={UID} config={config} onLogout={handleLogout}>
                                            <AuthenticationProvider store={authenticationValue}>
                                                <CacheProvider cache={cacheRef.current}>{children}</CacheProvider>
                                            </AuthenticationProvider>
                                        </ApiProvider>
                                    </ModalsProvider>
                                </NotificationsProvider>
                            </PreventLeaveProvider>
                        </Router>
                    </React.Fragment>
                </RightToLeftProvider>
            </CompatibilityCheck>
        </ConfigProvider>
    );
};

export default ProtonApp;
