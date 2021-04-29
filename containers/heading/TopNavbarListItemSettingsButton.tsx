import React from 'react';
import { c } from 'ttag';

import { DropdownMenu, DropdownMenuButton, DropdownMenuLink, Icon } from '../../components';
import SimpleDropdown from '../../components/dropdown/SimpleDropdown';
import TopNavbarListItemButton, {
    TopNavbarListItemButtonProps,
} from '../../components/topnavbar/TopNavbarListItemButton';
import { useModals } from '../../hooks';
import { MailShortcutsModal } from '../mail';
import ThemesModal from '../themes/ThemesModal';
import EarlyAccessModal from '../earlyAccess/EarlyAccessModal';

const TopNavbarListItemSettingsButton = React.forwardRef(
    (props: Omit<TopNavbarListItemButtonProps<'button'>, 'icon' | 'text' | 'as'>, ref: typeof props.ref) => {
        return (
            <TopNavbarListItemButton
                {...props}
                ref={ref}
                type="button"
                as="button"
                data-test-id="view:general-settings"
                icon={<Icon name="settings" />}
                text={c('Title').t`Settings`}
            />
        );
    }
);

const TopNavbarListItemSettingsDropdown = (props: any) => {
    const { createModal } = useModals();

    const handleEarlyAccessClick = () => {
        createModal(<EarlyAccessModal />);
    };

    const handleThemeClick = () => {
        createModal(<ThemesModal />);
    };

    const handleKeyboardShortcutsClick = () => {
        createModal(<MailShortcutsModal />, 'shortcuts-modal');
    };

    return (
        <SimpleDropdown as={TopNavbarListItemSettingsButton} originalPlacement="bottom" hasCaret={false} {...props}>
            <DropdownMenu style={{ minWidth: '16em' }} className="mt0-5 mb0-5">
                <DropdownMenuLink className="flex flex-nowrap flex-justify-space-between flex-align-items-center">
                    {c('Action').t`Go to settings`}
                    <Icon name="external-link" />
                </DropdownMenuLink>

                <hr className="mt0-5 mb0-5" />

                <DropdownMenuButton
                    onClick={handleEarlyAccessClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Early access`}
                    <span>On</span>
                </DropdownMenuButton>

                <DropdownMenuButton
                    onClick={handleThemeClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Theme`}
                    <span>Default</span>
                </DropdownMenuButton>

                <DropdownMenuButton
                    onClick={handleKeyboardShortcutsClick}
                    className="flex flex-nowrap flex-justify-space-between flex-align-items-center"
                >
                    {c('Action').t`Keyboard shortcuts`}
                    <span>On</span>
                </DropdownMenuButton>
            </DropdownMenu>
        </SimpleDropdown>
    );
};

export default TopNavbarListItemSettingsDropdown;
