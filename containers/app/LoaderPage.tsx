import React from 'react';
import { c } from 'ttag';
import { APPS, APPS_CONFIGURATION } from 'proton-shared/lib/constants';
import { noop } from 'proton-shared/lib/helpers/function';
import { UserModel } from 'proton-shared/lib/interfaces';
import { useConfig, useDocumentTitle } from '../../hooks';
import {
    FullLoader,
    Hamburger,
    Icon,
    MainLogo,
    PrivateMainArea,
    SidebarBackButton,
    SidebarList,
    SidebarListItemsWithSubsections,
    SidebarNav,
    SimpleDropdown,
    SimpleSidebarListItemHeader,
    TextLoader,
} from '../../components';
import Header from '../../components/header/Header';
import { PrivateAppContainer, TopNavbar } from './index';
import { TopNavbarItem } from './TopNavbar';
import SupportDropdown from '../heading/SupportDropdown';
import UserDropdownButton from '../heading/UserDropdownButton';
import { getAccountPages } from './accountPages';
import { getMailPages } from './mailPages';

interface Props {
    text?: string;
    loaderClassName?: string;
}

const LoaderPage = ({ text, loaderClassName = 'color-global-light' }: Props) => {
    const { APP_NAME } = useConfig();

    const appName = APPS_CONFIGURATION[APP_NAME].name;
    const textToDisplay = text || c('Info').t`Loading ${appName}`;

    useDocumentTitle(appName);

    if (document.location.pathname.includes('settings') || document.location.origin.includes('account')) {
        return (
            <PrivateAppContainer
                hasTopBanners={false}
                header={
                    <Header>
                        <div className="logo-container flex flex-justify-space-between flex-align-items-center flex-nowrap no-mobile">
                            <MainLogo to="/" />
                            <SimpleDropdown
                                hasCaret={false}
                                content={<Icon name="more" className="apps-dropdown-button-icon flex-item-noshrink" />}
                                className="apps-dropdown-button"
                                dropdownClassName="apps-dropdown"
                                originalPlacement="bottom-right"
                                title={c('Apps dropdown').t`Proton applications`}
                            />
                        </div>
                        <Hamburger expanded onToggle={noop} />
                        <TopNavbar>
                            <TopNavbarItem>
                                <SupportDropdown />
                            </TopNavbarItem>
                            <TopNavbarItem className="relative">
                                <div className="flex" data-cy-header="userDropdown">
                                    <UserDropdownButton
                                        user={{} as UserModel}
                                        buttonRef={undefined}
                                        isOpen={false}
                                        onClick={noop}
                                    />
                                </div>
                            </TopNavbarItem>
                        </TopNavbar>
                    </Header>
                }
                sidebar={
                    <div className="sidebar flex flex-nowrap flex-column no-print no-outline" data-expanded={false}>
                        <div className="no-desktop no-tablet flex-item-noshrink">
                            <div className="flex flex-justify-space-between flex-align-items-center pl1 pr1">
                                <Hamburger expanded onToggle={noop} data-focus-fallback={1} />
                            </div>
                        </div>
                        <div className="pl1 pr1 pb1 flex-item-noshrink">
                            <SidebarBackButton to="/" toApp={APPS.PROTONMAIL} target="_self">{c('Action')
                                .t`Back to Mailbox`}</SidebarBackButton>
                        </div>
                        <SidebarNav>
                            <SidebarList>
                                <SimpleSidebarListItemHeader
                                    text={c('Link').t`Account`}
                                    title={c('Link').t`Account`}
                                    onToggle={noop}
                                    toggle
                                    hasCaret={false}
                                />
                                <SidebarListItemsWithSubsections
                                    list={getAccountPages({})}
                                    pathname={window.location.pathname}
                                    activeSection=""
                                />
                                <SimpleSidebarListItemHeader
                                    text={c('Link').t`ProtonMail`}
                                    title={c('Link').t`ProtonMail`}
                                    onToggle={noop}
                                    toggle
                                    hasCaret={false}
                                />
                                <SidebarListItemsWithSubsections
                                    list={getMailPages({})}
                                    pathname={window.location.pathname}
                                    activeSection=""
                                />
                            </SidebarList>
                        </SidebarNav>
                    </div>
                }
            >
                <PrivateMainArea className="flex" />
            </PrivateAppContainer>
        );
    }

    return (
        <div className="centered-absolute text-center">
            <FullLoader className={loaderClassName} size={200} />
            <TextLoader>{textToDisplay}</TextLoader>
        </div>
    );
};

export default LoaderPage;
