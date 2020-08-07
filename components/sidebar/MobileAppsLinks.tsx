import React from 'react';

import { APPS, APPS_CONFIGURATION, FEATURE_FLAGS } from 'proton-shared/lib/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import useConfig from '../../containers/config/useConfig';
import MobileNavServices from './MobileNavServices';
import MobileNavLink from './MobileNavLink';

const { PROTONMAIL, PROTONCONTACTS, PROTONCALENDAR, PROTONDRIVE, PROTONACCOUNT } = APPS;

const MobileAppsLinks = () => {
    const { APP_NAME } = useConfig();

    const apps = [
        PROTONMAIL,
        PROTONCONTACTS,
        PROTONCALENDAR,
        FEATURE_FLAGS.includes('drive') && PROTONDRIVE,
        PROTONACCOUNT,
    ]
        .filter(isTruthy)
        .map((app) => ({
            toApp: app,
            icon: APPS_CONFIGURATION[app].icon,
            title: APPS_CONFIGURATION[app].name,
        }));

    return (
        <MobileNavServices>
            {apps.map(({ toApp, icon }, index) => {
                const isCurrent = toApp === APP_NAME;
                return <MobileNavLink key={index} to="/" icon={icon} current={isCurrent} />;
            })}
        </MobileNavServices>
    );
};

export default MobileAppsLinks;
