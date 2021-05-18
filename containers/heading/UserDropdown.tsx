import React, { useState, MouseEvent } from 'react';
import { c } from 'ttag';
import { APPS, isSSOMode, PLAN_SERVICES, SSO_PATHS } from 'proton-shared/lib/constants';
import { getAppHref } from 'proton-shared/lib/apps/helper';
import { requestFork } from 'proton-shared/lib/authentication/sessionForking';
import { FORK_TYPE } from 'proton-shared/lib/authentication/ForkInterface';
import { getPlanName, hasLifetime } from 'proton-shared/lib/helpers/subscription';
import { textToClipboard } from 'proton-shared/lib/helpers/browser';

import { useAuthentication, useConfig, useUser, useOrganization, useSubscription, useNotifications } from '../../hooks';
import { usePopperAnchor, Dropdown, Icon, DropdownMenu, DropdownMenuButton } from '../../components';
import { classnames, generateUID } from '../../helpers';
import UserDropdownButton, { Props } from './UserDropdownButton';

const UserDropdown = (rest: Omit<Props, 'user' | 'isOpen' | 'onClick'>) => {
    const { APP_NAME } = useConfig();
    const [organization] = useOrganization();
    const { Name: organizationName } = organization || {};
    const [user] = useUser();
    const { Email, DisplayName, Name } = user;
    const nameToDisplay = DisplayName || Name; // nameToDisplay can be falsy for external account
    const { logout } = useAuthentication();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();

    const { createNotification } = useNotifications();
    const handleCopyEmail = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        textToClipboard(Email, e.currentTarget);
        createNotification({
            type: 'success',
            text: c('Success').t`Email address copied to clipboard`,
        });
    };

    const handleSwitchAccount = () => {
        if (APP_NAME === APPS.PROTONACCOUNT) {
            const href = getAppHref(SSO_PATHS.SWITCH, APPS.PROTONACCOUNT);
            return document.location.assign(href);
        }
        return requestFork(APP_NAME, undefined, FORK_TYPE.SWITCH);
    };

    const handleLogout = () => {
        logout();
        close();
    };

    const { MAIL, VPN } = PLAN_SERVICES;
    const { PROTONVPN_SETTINGS } = APPS;
    const [subscription] = useSubscription();
    const planName = subscription
        ? hasLifetime(subscription)
            ? 'Lifetime'
            : getPlanName(subscription, APP_NAME === PROTONVPN_SETTINGS ? VPN : MAIL)
        : null;

    return (
        <>
            <UserDropdownButton
                data-cy-header="userDropdown"
                {...rest}
                user={user}
                ref={anchorRef}
                isOpen={isOpen}
                onClick={toggle}
            />
            <Dropdown
                id={uid}
                className="userDropdown"
                style={{ '--min-width': '18em', '--max-width': '30em' }}
                isOpen={isOpen}
                noMaxSize
                anchorRef={anchorRef}
                autoClose={false}
                onClose={close}
                originalPlacement="bottom-right"
            >
                <DropdownMenu>
                    {organizationName && APP_NAME !== APPS.PROTONVPN_SETTINGS ? (
                        <div className="pt0-25 pr1 pb0-25 pl1 flex flex-nowrap flex-justify-space-between flex-align-items-baseline on-mobile-flex-column">
                            <div className="text-ellipsis-two-lines text-bold">{organizationName}</div>
                            {planName ? (
                                <div className="ml2 on-mobile-ml0 on-mobile-mt0-5 flex-item-noshrink">
                                    <span className="badge-label-primary">{planName}</span>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {nameToDisplay ? (
                        <div className="pt0-25 pr1 pb0-25 pl1 flex flex-nowrap flex-justify-space-between flex-align-items-baseline on-mobile-flex-column">
                            <div className="text-ellipsis-two-lines">{nameToDisplay}</div>
                            {planName && (!organizationName || APP_NAME === APPS.PROTONVPN_SETTINGS) ? (
                                <div className="ml2 on-mobile-ml0 on-mobile-mt0-5 flex-item-noshrink">
                                    <span className="badge-label-primary">{planName}</span>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {planName && !nameToDisplay && (!organizationName || APP_NAME === APPS.PROTONVPN_SETTINGS) ? (
                        <span className="pt0-25 pr1 pb0-25 pl1 badge-label-primary">{planName}</span>
                    ) : null}

                    {Email ? (
                        <DropdownMenuButton
                            className="flex flex-nowrap flex-justify-space-between flex-align-items-center button-show-on-hover"
                            onClick={handleCopyEmail}
                            title={c('Action').t`Copy your email address to clipboard`}
                        >
                            <span className={classnames(['text-ellipsis', nameToDisplay && 'text-sm m0 color-weak'])}>
                                {Email}
                            </span>
                            <Icon className="ml1 button-show-on-hover-element" name="copy" />
                        </DropdownMenuButton>
                    ) : null}

                    <hr className="mt0-5 mb0-5" />

                    {isSSOMode ? (
                        <>
                            <DropdownMenuButton
                                className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                                onClick={handleSwitchAccount}
                            >
                                {c('Action').t`Switch account`}
                                <Icon className="ml1" name="account-switch" />
                            </DropdownMenuButton>

                            <hr className="mt0-5 mb0-5" />
                        </>
                    ) : null}

                    <DropdownMenuButton
                        className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                        onClick={handleLogout}
                        data-cy-header-user-dropdown="logout"
                    >
                        <span className="mr1">{c('Action').t`Sign out`}</span>
                        <Icon name="sign-out-right" />
                    </DropdownMenuButton>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default UserDropdown;
