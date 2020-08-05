import React, { FunctionComponent } from 'react';
import { isSSOMode, isStandaloneMode } from 'proton-shared/lib/constants';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import { Route, Switch } from 'react-router';
import StandalonePublicApp from './StandalonePublicApp';
import { Loader, useAuthentication } from '../../index';
import { PrivateAuthenticationStore, PublicAuthenticationStore } from './interface';
import SSOPublicApp from './SSOPublicApp';
import SSOForkConsumer from './SSOForkConsumer';

const Redirect = () => {
    document.location.replace(document.location.origin);
    return <Loader />;
};

interface Props {
    locales: TtagLocaleMap;
    PrivateApp: FunctionComponent<{ onLogout: () => void; locales: TtagLocaleMap }>;
}

const StandardSetup = ({ locales, PrivateApp }: Props) => {
    // Force for now
    const { UID, login, logout } = useAuthentication() as PublicAuthenticationStore & PrivateAuthenticationStore;

    if (UID) {
        return <PrivateApp locales={locales} onLogout={logout} />;
    }

    if (isSSOMode) {
        return (
            <Switch>
                <Route path="/fork">
                    <SSOForkConsumer locales={locales} onLogin={login} />
                </Route>
                <Route path="*">
                    <SSOPublicApp onLogin={login}/>
                </Route>
            </Switch>
        )
    }

    if (isStandaloneMode) {
        return <StandalonePublicApp locales={locales} onLogin={login} />;
    }

    return <Redirect />;
};

export default StandardSetup;
