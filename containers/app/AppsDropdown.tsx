import React from 'react';
import { c } from 'ttag';
import { APPS_CONFIGURATION, BRAND_NAME, APPS } from 'proton-shared/lib/constants';

import { AppLink, Icon, SimpleDropdown, SettingsLink } from '../../components';
import { useApps } from '../../hooks';

const AppsDropdown = () => {
    const applications = useApps();
    const apps = applications.map((app) => ({
        id: app,
        icon: APPS_CONFIGURATION[app].icon,
        title: APPS_CONFIGURATION[app].bareName,
    }));

    const vpnName = APPS_CONFIGURATION['proton-vpn-settings'].bareName;

    return (
        <SimpleDropdown
            as="button"
            type="button"
            hasCaret={false}
            content={<Icon name="more" className="apps-dropdown-button-icon flex-item-noshrink" />}
            className="apps-dropdown-button flex-item-noshrink"
            dropdownClassName="apps-dropdown"
            originalPlacement="bottom-left"
            title={c('Apps dropdown').t`Proton applications`}
        >
            <ul className="apps-dropdown-list unstyled m1 scroll-if-needed">
                {apps.map(({ id, icon, title }, index) => (
                    <React.Fragment key={id}>
                        <li>
                            <AppLink
                                to="/"
                                toApp={id}
                                className="apps-dropdown-link"
                                title={c('Apps dropdown').t`Go to ${title}`}
                            >
                                <Icon name={icon} size={28} className="apps-dropdown-icon" />
                                <div>{BRAND_NAME}</div>
                                <div className="text-bold">{title}</div>
                            </AppLink>
                        </li>
                        {index % 2 !== 0 && (
                            <li className="apps-dropdown-item-hr dropdown-item-hr" aria-hidden="true" />
                        )}
                    </React.Fragment>
                ))}
                <li>
                    <SettingsLink
                        path="/downloads"
                        app={APPS.PROTONVPN_SETTINGS}
                        title={c('Apps dropdown').t`Go to ${APPS_CONFIGURATION[APPS.PROTONVPN_SETTINGS].bareName}`}
                        className="apps-dropdown-link"
                    >
                        <Icon name="protonvpn" size={28} className="apps-dropdown-icon apps-dropdown-icon-vpn" />
                        <div>{BRAND_NAME}</div>
                        <div className="text-bold">{vpnName}</div>
                    </SettingsLink>
                </li>
            </ul>
        </SimpleDropdown>
    );
};

export default AppsDropdown;
