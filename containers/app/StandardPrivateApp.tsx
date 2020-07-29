import React, { useState, useRef, useEffect } from 'react';
import { UserModel, UserSettingsModel } from 'proton-shared/lib/models';
import { unique } from 'proton-shared/lib/helpers/array';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { getClosestMatches, getBrowserLocale } from 'proton-shared/lib/i18n/helper';
import createEventManager from 'proton-shared/lib/eventManager/eventManager';
import { loadModels } from 'proton-shared/lib/models/helper';
import { destroyOpenPGP, loadOpenPGP } from 'proton-shared/lib/openpgp';
import { Model } from 'proton-shared/lib/interfaces/Model';
import { isSSOMode } from 'proton-shared/lib/constants';
import { LocalKeyResponse } from 'proton-shared/lib/authentication/interface';
import { getLocalKey } from 'proton-shared/lib/api/auth';

import {
    EventManagerProvider,
    ModalsChildren,
    ThemeInjector,
    DensityInjector,
    ContactProvider,
    useAuthentication,
    useApi,
    useCache
} from '../../index';

import EventModelListener from '../eventManager/EventModelListener';
import EventNotices from '../eventManager/EventNotices';
import LoaderPage from './LoaderPage';
import ForceRefreshProvider from '../forceRefresh/Provider';

import loadEventID from './loadEventID';
import StandardLoadError from './StandardLoadError';
import { getDecryptedPersistedSessionBlob } from './authHelper';

interface Props<T, M extends Model<T>, E, EvtM extends Model<E>> {
    locales?: any;
    onInit?: () => void;
    onLogout: () => void;
    fallback?: React.ReactNode;
    openpgpConfig?: object;
    preloadModels?: M[];
    eventModels?: EvtM[];
    noModals?: boolean;
    children: React.ReactNode;
}

const StandardPrivateApp = <T, M extends Model<T>, E, EvtM extends Model<E>>({
    locales = {},
    onLogout,
    onInit,
    fallback,
    openpgpConfig,
    preloadModels = [],
    eventModels = [],
    noModals = false,
    children,
}: Props<T, M, E, EvtM>) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const eventManagerRef = useRef<ReturnType<typeof createEventManager>>();
    const api = useApi();
    const cache = useCache();
    const authentication = useAuthentication();

    useEffect(() => {
        const eventManagerPromise = loadEventID(api, cache).then((eventID) => {
            eventManagerRef.current = createEventManager({ api, eventID });
        });

        const modelsPromise = loadModels(unique([UserSettingsModel, UserModel, ...preloadModels]), { api, cache })
            .then(([userSettings]) => {
                return loadLocale({
                    ...getClosestMatches({ locale: userSettings.Locale, browserLocale: getBrowserLocale(), locales }),
                    locales,
                });
            })
            .then(() => onInit?.()); // onInit has to happen after locales have been loaded to allow applications to override it

        let authPromise = Promise.resolve();
        if (isSSOMode) {
            const persistedSession = authentication.getTmpPersistedSession();
            const persistedSessionBlobString = persistedSession?.blob;
            // If there is a temporary persisted session, attempt to read it
            if (persistedSessionBlobString) {
                const run = async () => {
                    const { ClientKey } = await api<LocalKeyResponse>(getLocalKey());
                    const { keyPassword } = await getDecryptedPersistedSessionBlob(
                        ClientKey,
                        persistedSessionBlobString
                    );
                    authentication.setPassword(keyPassword);
                };
                authPromise = run();
            }
        }

        Promise.all([eventManagerPromise, modelsPromise, authPromise, loadOpenPGP(openpgpConfig)])
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                if (e.name === 'InactiveSession') {
                    return onLogout();
                }
                setError(true);
            });

        return () => {
            destroyOpenPGP();
        };
    }, []);

    if (error) {
        return <StandardLoadError />;
    }

    if (loading || !eventManagerRef.current) {
        return (
            <>
                <ModalsChildren />
                {fallback || <LoaderPage />}
            </>
        );
    }

    return (
        <EventManagerProvider eventManager={eventManagerRef.current}>
            <ContactProvider>
                <EventModelListener models={eventModels} />
                <EventNotices />
                <ThemeInjector />
                <DensityInjector />
                {!noModals && <ModalsChildren />}
                <ForceRefreshProvider>{children}</ForceRefreshProvider>
            </ContactProvider>
        </EventManagerProvider>
    );
};

export default StandardPrivateApp;
