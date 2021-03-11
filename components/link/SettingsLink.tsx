import React from 'react';
import { APPS, APPS_CONFIGURATION, APP_NAMES } from 'proton-shared/lib/constants';
import AppLink from './AppLink';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    path: string;
    app: APP_NAMES;
}

const SettingsLink = ({ path, app, children, ...rest }: Props) => {
    const slug = APPS_CONFIGURATION[app].settingsSlug;

    return (
        <AppLink to={`/${slug}${path}`} toApp={APPS.PROTONACCOUNT} {...rest}>
            {children}
        </AppLink>
    );
};

export default SettingsLink;
