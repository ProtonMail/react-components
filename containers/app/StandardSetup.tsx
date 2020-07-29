import React, { FunctionComponent } from 'react';
import { isSSOMode, isStandaloneMode } from 'proton-shared/lib/constants';
import StandalonePublicApp from './StandalonePublicApp';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import { Loader, useAuthentication } from '../../index';
import { PrivateAuthenticationStore, PublicAuthenticationStore } from './interface';
import SSOPublicApp from './SSOPublicApp';

const Redirect = () => {
    document.location.replace(document.location.origin);
    return <Loader />;
};

interface Props {
    locales: TtagLocaleMap;
    PrivateApp: FunctionComponent<{ onLogout: () => void }>;
}

const Setup = ({ locales, PrivateApp }: Props) => {
    // Force for now
    const { UID, login, logout } = useAuthentication() as PublicAuthenticationStore & PrivateAuthenticationStore;

    if (UID) {
        return <PrivateApp onLogout={logout} />;
    }

    if (isSSOMode) {
        return <SSOPublicApp onLogin={login} />;
    }

    if (isStandaloneMode) {
        return <StandalonePublicApp locales={locales} onLogin={login} />;
    }

    return <Redirect />;
};

export default Setup;
