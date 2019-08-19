import React from 'react';
import PropTypes from 'prop-types';
import { Icon, useUser } from 'react-components';
import { APPS } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import StorageSpaceStatus from './StorageSpaceStatus';

const { PROTONMAIL, PROTONCONTACTS, PROTONCALENDAR, PROTONMAIL_SETTINGS, PROTONVPN_SETTINGS } = APPS;

const AppsSidebar = ({ currentApp = '' }) => {
    const [{ isPaid }] = useUser();
    const apps = [
        { ids: [PROTONMAIL, PROTONMAIL_SETTINGS], icon: 'protonmail', title: 'ProtonMail', link: '/inbox' },
        isPaid && { ids: [PROTONCALENDAR], icon: 'calendar', title: 'ProtonCalendar', link: '/calendar' },
        { ids: [PROTONCONTACTS], icon: 'contacts', title: 'ProtonContacts', link: '/contacts' },
        { ids: [PROTONVPN_SETTINGS], icon: 'protonvpn', title: c('Title').t`ProtonVPN settings`, link: '/settings/vpn' }
    ].filter(Boolean);

    return (
        <aside className="aside noprint" id="aside-bar">
            <ul className="unstyled m0 aligncenter  flex flex-column h100">
                {apps.map(({ ids = [], icon, title, link, target }, index) => {
                    const isCurrent = ids.includes(currentApp);
                    const key = `${index}`;
                    return (
                        <li key={key} className="mb0-5">
                            <a
                                href={link}
                                target={target ? target : '_self'}
                                className="center flex js-notyet aside-link"
                                title={title}
                                disabled={isCurrent}
                                aria-current={isCurrent}
                            >
                                <Icon name={icon} />
                            </a>
                        </li>
                    );
                })}
                <li className="flex-item-fluid" />
                <li key="storageStatus" className="mb0-5">
                    <StorageSpaceStatus />
                </li>
            </ul>
        </aside>
    );
};

AppsSidebar.propTypes = {
    currentApp: PropTypes.string
};

export default AppsSidebar;
