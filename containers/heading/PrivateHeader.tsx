import React from 'react';
import { APPS } from 'proton-shared/lib/constants';
import { c } from 'ttag';

import { AppLink, Hamburger, Icon, SettingsLink } from '../../components';
import { useConfig, useUser, usePlans, useSubscription, usePaidCookie } from '../../hooks';
import Header, { Props as HeaderProps } from '../../components/header/Header';

import UserDropdown from './UserDropdown';
import { AppsDropdown } from '../app';
import TopNavbarListItemHelpDropdown from './TopNavbarListItemHelpDropdown';
import TopNavbarListItemBlackFridayButton from './TopNavbarListItemBlackFridayButton';
import useBlackFriday from './useBlackFriday';
import { TopNavbar, TopNavbarList, TopNavbarListItem } from '../../components/topnavbar';
import TopNavbarListItemButton from '../../components/topnavbar/TopNavbarListItemButton';

interface Props extends HeaderProps {
    logo?: React.ReactNode;
    settingsButton?: React.ReactNode;
    contactsButton?: React.ReactNode;
    feedbackButton?: React.ReactNode;
    backUrl?: string;
    floatingButton?: React.ReactNode;
    searchBox?: React.ReactNode;
    searchDropdown?: React.ReactNode;
    helpDropdown?: React.ReactNode;
    hasAppsDropdown?: boolean;
    title: string;
    expanded: boolean;
    handleES: () => Promise<void>;
    onToggleExpand?: () => void;
    isNarrow?: boolean;
}

const PrivateHeader = ({
    isNarrow,
    hasAppsDropdown = true,
    logo,
    settingsButton,
    contactsButton,
    feedbackButton,
    backUrl,
    searchBox,
    searchDropdown,
    helpDropdown,
    floatingButton,
    expanded,
    handleES,
    onToggleExpand,
    title,
}: Props) => {
    const [{ hasPaidMail, hasPaidVpn }] = useUser();
    const [plans = []] = usePlans();
    const [subscription] = useSubscription();
    const { APP_NAME } = useConfig();
    const showBlackFridayButton = useBlackFriday();
    usePaidCookie();

    if (backUrl) {
        return (
            <Header>
                <TopNavbarListItemButton
                    data-test-id="view:general-back"
                    as={AppLink}
                    to={backUrl}
                    icon={<Icon name="arrow-left" />}
                    text={c('Title').t`Back`}
                />
                <TopNavbar>
                    <TopNavbarList>
                        <TopNavbarListItem>
                            <UserDropdown />
                        </TopNavbarListItem>
                    </TopNavbarList>
                </TopNavbar>
            </Header>
        );
    }

    const isVPN = APP_NAME === APPS.PROTONVPN_SETTINGS;

    return (
        <Header>
            <div className="logo-container flex flex-justify-space-between flex-align-items-center flex-nowrap no-mobile">
                {logo}
                {hasAppsDropdown ? <AppsDropdown /> : null}
            </div>
            <Hamburger expanded={expanded} onToggle={onToggleExpand} />
            {title && isNarrow ? <span className="text-lg lh-rg mtauto mbauto text-ellipsis">{title}</span> : null}
            {isNarrow ? null : searchBox}
            <TopNavbar>
<<<<<<< HEAD
                <TopNavbarList>
                    {isNarrow && searchDropdown ? <TopNavbarListItem>{searchDropdown}</TopNavbarListItem> : null}
                    {showBlackFridayButton ? (
                        <TopNavbarListItem noShrink>
                            <TopNavbarListItemBlackFridayButton plans={plans} subscription={subscription} />
                        </TopNavbarListItem>
                    ) : null}
                    {hasPaidMail || isNarrow || isVPN ? null : (
                        <TopNavbarListItem noShrink>
                            <TopNavbarListItemButton
                                as={SettingsLink}
                                text={c('Link').t`Upgrade`}
                                icon={<Icon name="upgrade-to-paid" />}
                                path="/dashboard"
                                app={APP_NAME}
                                title={c('Link').t`Upgrade`}
                            />
                        </TopNavbarListItem>
                    )}
                    {hasPaidVpn || isNarrow || !isVPN ? null : (
                        <TopNavbarListItem noShrink>
                            <TopNavbarListItemButton
                                as={AppLink}
                                text={c('Link').t`Upgrade`}
                                icon={<Icon name="upgrade-to-paid" />}
                                to="/dashboard"
                            />
                        </TopNavbarListItem>
                    )}
                    {feedbackButton ? <TopNavbarListItem noShrink>{feedbackButton}</TopNavbarListItem> : null}
                    {contactsButton ? <TopNavbarListItem noShrink>{contactsButton}</TopNavbarListItem> : null}
                    {settingsButton ? <TopNavbarListItem noShrink>{settingsButton}</TopNavbarListItem> : null}
                    <TopNavbarListItem noShrink>{helpDropdown || <TopNavbarListItemHelpDropdown />}</TopNavbarListItem>
                    <TopNavbarListItem className="relative">
                        <UserDropdown />
                    </TopNavbarListItem>
                </TopNavbarList>
=======
                {isNarrow && searchDropdown ? <TopNavbarItem>{searchDropdown}</TopNavbarItem> : null}
                {showBlackFridayButton ? (
                    <TopNavbarItem>
                        <BlackFridayButton plans={plans} subscription={subscription} />
                    </TopNavbarItem>
                ) : null}
                {hasPaidMail || isNarrow || isVPN ? null : (
                    <TopNavbarItem>
                        <UpgradeButton />
                    </TopNavbarItem>
                )}
                {hasPaidVpn || isNarrow || !isVPN ? null : (
                    <TopNavbarItem>
                        <UpgradeVPNButton />
                    </TopNavbarItem>
                )}
                {!contactsButton ? null : <TopNavbarItem>{contactsButton}</TopNavbarItem>}
                {!settingsButton ? null : <TopNavbarItem>{settingsButton}</TopNavbarItem>}
                <TopNavbarItem>{supportDropdown || <SupportDropdown />}</TopNavbarItem>
                <TopNavbarItem className="relative">
                    <UserDropdown handleES={handleES} />
                </TopNavbarItem>
>>>>>>> fa9dc5bd (Delete DB at logout)
            </TopNavbar>
            {isNarrow && floatingButton ? floatingButton : null}
        </Header>
    );
};

export default PrivateHeader;
