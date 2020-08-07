import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import { StandardPublicApp, MinimalLoginContainer, ProtonLoginCallback } from '../../index';

interface Props {
    onLogin: ProtonLoginCallback;
    locales: TtagLocaleMap;
}
const StandalonePublicApp = ({ onLogin, locales }: Props) => {
    return (
        <StandardPublicApp locales={locales}>
            <Switch>
                <Route render={() => <MinimalLoginContainer onLogin={onLogin} />} />
            </Switch>
        </StandardPublicApp>
    );
};

export default StandalonePublicApp;
