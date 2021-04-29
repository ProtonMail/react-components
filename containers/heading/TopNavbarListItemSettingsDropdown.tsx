import React, { ComponentPropsWithoutRef } from 'react';
import { c } from 'ttag';
import { PROTON_THEMES } from 'proton-shared/lib/themes/themes';

import { AppLink, DropdownMenu, DropdownMenuButton, DropdownMenuLink, Icon } from '../../components';
import SimpleDropdown from '../../components/dropdown/SimpleDropdown';
import TopNavbarListItemButton, {
    TopNavbarListItemButtonProps,
} from '../../components/topnavbar/TopNavbarListItemButton';
import { useEarlyAccess, useMailSettings, useModals } from '../../hooks';
import { MailShortcutsModal } from '../mail';
import ThemesModal from '../themes/ThemesModal';
import EarlyAccessModal from '../earlyAccess/EarlyAccessModal';
import { useTheme } from '../themes';

const TopNavbarListItemSettingsButton = React.forwardRef(
    (props: Omit<TopNavbarListItemButtonProps<'button'>, 'icon' | 'text' | 'as'>, ref: typeof props.ref) => {
        return (
            <TopNavbarListItemButton
                {...props}
                ref={ref}
                type="button"
                as="button"
                data-test-id="view:general-settings"
                icon={<Icon name="settings-master" />}
                text={c('Title').t`Settings`}
            />
        );
    }
);

interface Props extends ComponentPropsWithoutRef<typeof AppLink> {}

const TopNavbarListItemSettingsDropdown = (props: Props) => {
    const { createModal } = useModals();
    const earlyAccess = useEarlyAccess();
    const [theme] = useTheme();
    const [{ Shortcuts } = { Shortcuts: 0 }] = useMailSettings();

    const handleEarlyAccessClick = () => {
        createModal(<EarlyAccessModal />);
    };

    const handleThemeClick = () => {
        createModal(<ThemesModal />);
    };

    const handleKeyboardShortcutsClick = () => {
        createModal(<MailShortcutsModal />, 'shortcuts-modal');
    };

    const { to, toApp } = props;

    return (
        <SimpleDropdown as={TopNavbarListItemSettingsButton} originalPlacement="bottom" hasCaret={false}>
            <DropdownMenu style={{ minWidth: '16em' }} className="mt0-5 mb0-5">
                <DropdownMenuLink
                    as={AppLink}
                    to={to}
                    toApp={toApp}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Go to settings`}
                    <Icon name="external-link" />
                </DropdownMenuLink>

                <hr className="mt0-5 mb0-5" />

                <DropdownMenuButton
                    onClick={handleEarlyAccessClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Early access`}
                    <span className="color-primary">
                        {earlyAccess.value ? c('Enabled').t`On` : c('Disabled').t`Off`}
                    </span>
                </DropdownMenuButton>
                <DropdownMenuButton
                    onClick={handleThemeClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Theme`}
                    <span className="color-primary">{PROTON_THEMES[theme].getI18NLabel()}</span>
                </DropdownMenuButton>
                <DropdownMenuButton
                    onClick={handleKeyboardShortcutsClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Keyboard shortcuts`}
                    <span className="color-primary">{Shortcuts ? c('Enabled').t`On` : c('Disabled').t`Off`}</span>
                </DropdownMenuButton>
            </DropdownMenu>
        </SimpleDropdown>
    );
};

export default TopNavbarListItemSettingsDropdown;
