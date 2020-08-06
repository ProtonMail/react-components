import React, { FunctionComponent, useEffect, useState } from 'react';
import { APPS, isSSOMode, isStandaloneMode } from 'proton-shared/lib/constants';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import { Route, Switch, Redirect } from 'react-router-dom';
import { replaceUrl } from 'proton-shared/lib/helpers/browser';
import { getAppHref } from 'proton-shared/lib/apps/helper';
import { requestFork } from 'proton-shared/lib/authentication/forking';
import StandalonePublicApp from './StandalonePublicApp';
import { Loader, OnLoginCallbackArguments, useAuthentication, useConfig } from '../../index';
import { PrivateAuthenticationStore, PublicAuthenticationStore } from './interface';
import SSOPublicApp from './SSOPublicApp';
import SSOForkConsumer from './SSOForkConsumer';

const ReplaceToBase = () => {
    document.location.replace(document.location.origin);
    return <Loader />;
};

interface Props {
    locales: TtagLocaleMap;
    PrivateApp: FunctionComponent<{ onLogout: () => void; locales: TtagLocaleMap }>;
}

const RedirectOnce = ({ to, onDone }: { to: string; onDone: () => void }) => {
    useEffect(onDone, []);
    return <Redirect to={to} />;
};

const StandardSetup = ({ locales, PrivateApp }: Props) => {
    // Force for now
    const { UID, login, logout } = useAuthentication() as PublicAuthenticationStore & PrivateAuthenticationStore;
    const { APP_NAME } = useConfig();
    const [toPathname, setToPathname] = useState<string | undefined>();

    if (UID) {
        if (toPathname) {
            return (
                <RedirectOnce
                    to={toPathname}
                    onDone={() => {
                        setToPathname(undefined);
                    }}
                />
            );
        }
        return <PrivateApp locales={locales} onLogout={logout} />;
    }

    if (isSSOMode) {
        const handleInvalidFork = () => {
            // Fork invalid, so just fall back to the account page.
            return replaceUrl(getAppHref('/', APPS.PROTONACCOUNT));
        };
        const handleInactiveSession = (localID?: number) => {
            return requestFork(APP_NAME, localID);
        };
        const handleLogin = (args: OnLoginCallbackArguments, pathname: string) => {
            setToPathname(`/${pathname}`);
            return login(args);
        };
        return (
            <Switch>
                <Route path="/fork">
                    <SSOForkConsumer onInvalidFork={handleInvalidFork} onLogin={handleLogin} />
                </Route>
                <Route path="*">
                    <SSOPublicApp onLogin={login} onInactiveSession={handleInactiveSession} />
                </Route>
            </Switch>
        );
    }

    if (isStandaloneMode) {
        return <StandalonePublicApp locales={locales} onLogin={login} />;
    }

    return <ReplaceToBase />;
};

export default StandardSetup;
