import React from 'react';

import { APPS, FEATURE_FLAGS } from 'proton-shared/lib/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import useConfig from '../../containers/config/useConfig';
import MobileNavServices from './MobileNavServices';
import MobileNavLink from './MobileNavLink';

const { PROTONMAIL, PROTONCONTACTS, PROTONCALENDAR, PROTONDRIVE } = APPS;

const MobileAppsLinks = () => {
    const { APP_NAME } = useConfig();

    const apps = [
        { to: '/', toApp: PROTONMAIL, icon: 'protonmail' },
        { to: '/', toApp: PROTONCONTACTS, icon: 'protoncontacts' },
        { to: '/', toApp: PROTONCALENDAR, icon: 'protoncalendar' },
        FEATURE_FLAGS.includes('drive') && { to: '/drive', toApp: PROTONDRIVE, icon: 'protondrive' },
    ].filter(isTruthy);

    return (
        <MobileNavServices>
            {apps.map(({ to, toApp, icon }, index) => {
                const isCurrent = toApp === APP_NAME;
                return (
                    <MobileNavLink
                        key={index}
                        to={to}
                        icon={icon}
                        current={isCurrent}
                    />
                );
            })}
        </MobileNavServices>
    );
};

export default MobileAppsLinks;
