import React from 'react';

import { APPS } from 'proton-shared/lib/constants';

import useConfig from '../../containers/config/useConfig';
import MobileNavServices from './MobileNavServices';
import MobileNavLink from './MobileNavLink';

const { PROTONMAIL, PROTONCONTACTS, PROTONMAIL_SETTINGS, PROTONCALENDAR, PROTONDRIVE } = APPS;

const MobileAppsLinks = () => {
    const { APP_NAME } = useConfig();

    const apps = [
        { appNames: [PROTONMAIL, PROTONMAIL_SETTINGS], to: '/inbox', icon: 'protonmail' },
        { appNames: [PROTONCONTACTS], to: '/contacts', icon: 'protoncontacts' },
        { appNames: [PROTONCALENDAR], to: '/calendar', icon: 'protoncalendar' },
        { appNames: [PROTONDRIVE], to: '/drive', icon: 'protondrive' }
    ];

    return (
        <MobileNavServices>
            {apps.map(({ appNames, to, icon }, index) => {
                const isCurrent = appNames.includes(APP_NAME);
                return <MobileNavLink key={index} to={to} icon={icon} external={!isCurrent} current={isCurrent} />;
            })}
        </MobileNavServices>
    );
};

export default MobileAppsLinks;
