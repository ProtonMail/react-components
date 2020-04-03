import React, { useState, useEffect } from 'react';
import { ReactNodeArray } from 'prop-types';
import { Icon, useConfig, Tooltip, Link, ToggleMenu } from 'react-components';
import { APPS, USER_SCOPES } from 'proton-shared/lib/constants';
import { hasScope } from 'proton-shared/lib/helpers/scope';

import { useUserScopes } from '../../hooks/useUserScopes';

const { PROTONMAIL, PROTONCONTACTS, PROTONMAIL_SETTINGS, PROTONCALENDAR, PROTONDRIVE } = APPS;

interface Props {
    items: ReactNodeArray;
    isCollapsedMenu: boolean;
    setCollapseMenu: () => void;
}

const AppsSidebar = ({ items = [], isCollapsedMenu, setCollapseMenu }: Props) => {
    const { APP_NAME } = useConfig();
    const [userScopes, loadingUserScopes] = useUserScopes();

    const driveApp = {
        appNames: [PROTONDRIVE],
        icon: 'protondrive',
        title: 'ProtonDrive',
        link: '/drive'
    };
    const initialApps = [
        { appNames: [PROTONMAIL, PROTONMAIL_SETTINGS], icon: 'protonmail', title: 'ProtonMail', link: '/inbox' },
        { appNames: [PROTONCONTACTS], icon: 'protoncontacts', title: 'ProtonContacts', link: '/contacts' },
        {
            appNames: [PROTONCALENDAR],
            icon: 'protoncalendar',
            title: 'ProtonCalendar',
            link: '/calendar'
        }
    ].filter(Boolean);

    const [apps, setApps] = useState(initialApps);

    useEffect(() => {
        if (!loadingUserScopes && hasScope(userScopes, USER_SCOPES.DRIVE)) {
            setApps([...initialApps, driveApp].filter(Boolean));
        }
    }, [userScopes, loadingUserScopes]);

    return (
        <aside
            className="aside flex-column flex-nowrap noprint nomobile is-hidden-when-sidebar-is-collapsed"
            id="aside-bar"
        >
            <div className="flex mb2 nomobile">
                <ToggleMenu isCollapsedMenu={isCollapsedMenu} onToggleMenu={setCollapseMenu} />
            </div>

            <ul className="unstyled m0 aligncenter flex flex-column flex-item-fluid aside-listIcons">
                {apps.map(({ appNames = [], icon, title, link }, index) => {
                    const isCurrent = appNames.includes(APP_NAME);
                    const key = `${index}`;
                    return (
                        <li key={key} className="mb0-5">
                            <Tooltip title={title} originalPlacement="right">
                                <Link
                                    to={link}
                                    className="center flex aside-link"
                                    external={!isCurrent}
                                    aria-current={isCurrent}
                                >
                                    <Icon name={icon} className="aside-linkIcon mauto" />
                                </Link>
                            </Tooltip>
                        </li>
                    );
                })}
                <li className="flex-item-fluid" />
                {items.map((item, index) => (
                    <li key={`${index}`} className="mb0-5">
                        {item}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default AppsSidebar;
