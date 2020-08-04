import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getBrowserLocale, getClosestMatches } from 'proton-shared/lib/i18n/helper';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { resumeSession, getValidatedLocalID, getValidatedApp } from 'proton-shared/lib/authentication/helper';
import { PersistentSessionInvalid } from 'proton-shared/lib/authentication/error';
import * as H from 'history';
import { LoaderPage, ModalsChildren, GenericError, useApi } from '../../index';
import { getForkEncryptedBlob } from 'proton-shared/lib/authentication/session';
import { forkSession } from 'proton-shared/lib/api/auth';
import { ForkResponse } from 'proton-shared/lib/authentication/interface';
import { APPS_CONFIGURATION } from 'proton-shared/lib/constants';

interface Props {
    history: H.History;
    locales?: any;
    openpgpConfig?: object;
    children: React.ReactNode;
}

const SSOAuthorize = ({ history, locales = {}, openpgpConfig, children }: Props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const api = useApi();

    useEffect(() => {
        const browserLocale = getBrowserLocale();

        const params = new URLSearchParams(window.location.search);
        const app = params.get('app') || '';
        const state = params.get('state') || '';
        const localID = params.get('u') || '';

        const validatedLocalID = getValidatedLocalID(localID);
        const validatedApp = getValidatedApp(app);
        const validatedState = state.slice(0, 100);
        const validatedSessionKey = window.location.hash;

        if (validatedApp === undefined || !validatedState || !validatedSessionKey) {
            return history.replace('/');
        }

        const loadForkDependencies = async () => {
            if (validatedLocalID === undefined) {
                // Traverse persisted sessions, find a logged in account, and then get the list of active sessions
                throw new Error('Handle account switcher');
                return;
            }

            const validatedSession = await resumeSession(api, validatedLocalID);
            const payload = validatedSession.keyPassword ?
                await getForkEncryptedBlob(validatedSessionKey, { keyPassword: validatedSession.keyPassword })
                : undefined;
            const childClientID = APPS_CONFIGURATION[validatedApp].clientID;
            const { Selector } = await api<ForkResponse>(forkSession({
                Payload: payload,
                ChildClientID: childClientID,
                Independent: 0
            }));

        };

        (async () => {
            await Promise.all([
                loadForkDependencies(),
                loadOpenPGP(openpgpConfig),
                loadLocale({
                    ...getClosestMatches({ locale: browserLocale, browserLocale, locales }),
                    locales,
                }),
            ]);
        })()
            .then(() => setLoading(false))
            .catch((e) => {
                if (e instanceof PersistentSessionInvalid) {
                    return history.replace('/');
                }
                setError(true)
            });
    }, []);

    if (error) {
        return <GenericError />;
    }

    if (loading) {
        return <LoaderPage />;
    }

    return (
        <>
            <ModalsChildren />
            {children}
        </>
    );
};

export default SSOAuthorize;
