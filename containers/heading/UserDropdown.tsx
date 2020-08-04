import React, { useState } from 'react';
import { c } from 'ttag';
import { revoke } from 'proton-shared/lib/api/auth';
import { APPS, PLANS } from 'proton-shared/lib/constants';
import { getPlanName } from 'proton-shared/lib/helpers/subscription';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';
import {
    useUser,
    useOrganization,
    useAuthentication,
    useModals,
    usePopperAnchor,
    useApi,
    Icon,
    Dropdown,
    DonateModal,
    generateUID,
    PrimaryButton,
    useConfig,
    useSubscription,
} from '../..';

import UserDropdownButton from './UserDropdownButton';
import AppLink from '../../components/link/AppLink';

const { PROFESSIONAL, VISIONARY } = PLANS;

const UserDropdown = ({ ...rest }) => {
    const { APP_NAME } = useConfig();
    const api = useApi();
    const [user] = useUser();
    const { DisplayName, Email, Name } = user;
    const [{ Name: organizationName } = { Name: '' }] = useOrganization();
    const [subscription] = useSubscription();
    const { logout } = useAuthentication();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();
    const planName = getPlanName(subscription) as PLANS;

    const handleSupportUsClick = () => {
        createModal(<DonateModal />);
    };

    const handleLogout = () => {
        api(revoke()); // Kick off the revoke request, but don't care for the result.
        logout();
    };

    return (
        <div className="flex" data-cy-header="userDropdown">
            <UserDropdownButton {...rest} user={user} buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} />
            <Dropdown
                id={uid}
                className="userDropdown"
                isOpen={isOpen}
                noMaxSize
                anchorRef={anchorRef}
                onClose={close}
                originalPlacement="bottom-right"
            >
                <ul className="unstyled mt0 mb0">
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1 flex flex-column">
                        <strong title={DisplayName || Name} className="ellipsis mw100 capitalize">
                            {DisplayName || Name}
                        </strong>
                        {Email ? (
                            <span title={Email} className="ellipsis mw100">
                                {Email}
                            </span>
                        ) : null}
                        {[PROFESSIONAL, VISIONARY].includes(planName) && organizationName ? (
                            <span title={organizationName} className="ellipsis mw100">
                                {organizationName}
                            </span>
                        ) : null}
                    </li>
                    {APP_NAME === APPS.PROTONVPN_SETTINGS || APP_NAME === APPS.PROTONACCOUNT ? null : (
                        <li className="dropDown-item">
                            <AppLink
                                className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                                to="/settings"
                                toApp={getAccountSettingsApp()}
                            >
                                <Icon className="mt0-25 mr0-5" name="settings-master" />
                                {c('Action').t`Settings`}
                            </AppLink>
                        </li>
                    )}
                    <li className="dropDown-item">
                        <a
                            className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                            href="https://shop.protonmail.com"
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5" name="shop" />
                            {c('Action').t`Proton shop`}
                        </a>
                    </li>
                    <li className="dropDown-item">
                        <button
                            type="button"
                            className="w100 flex underline-hover dropDown-item-link pl1 pr1 pt0-5 pb0-5 alignleft"
                            onClick={handleSupportUsClick}
                        >
                            <Icon className="mt0-25 mr0-5" name="donate" />
                            {c('Action').t`Support us`}
                        </button>
                    </li>
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1 flex">
                        <PrimaryButton
                            className="w100 aligncenter navigationUser-logout"
                            onClick={handleLogout}
                            data-cy-header-user-dropdown="logout"
                        >
                            {c('Action').t`Logout`}
                        </PrimaryButton>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default UserDropdown;
