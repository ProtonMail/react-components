import React from 'react';
import { c } from 'ttag';
import { APPS, BRAND_NAME } from 'proton-shared/lib/constants';
import { Icon, DropdownMenu, DropdownMenuButton, DropdownMenuLink } from '../../components';
import { useModals, useAuthentication, useConfig } from '../../hooks';

import BugModal from '../support/BugModal';
import AuthenticatedBugModal from '../support/AuthenticatedBugModal';
import { OnboardingModal } from '../onboarding';
import SimpleDropdown, { Props as SimpleDropdownProps } from '../../components/dropdown/SimpleDropdown';
import TopNavbarListItemButton, {
    TopNavbarListItemButtonProps,
} from '../../components/topnavbar/TopNavbarListItemButton';

interface OwnProps {
    onOpenShortcutsModal?: () => void;
    content?: string;
}

const TopNavbarListItemHelpButton = React.forwardRef(
    (props: Omit<TopNavbarListItemButtonProps<'button'>, 'icon' | 'text' | 'as'>, ref: typeof props.ref) => {
        return (
            <TopNavbarListItemButton
                {...props}
                ref={ref}
                as="button"
                type="button"
                icon={<Icon name="support1" />}
                text={c('Header').t`Help`}
            />
        );
    }
);

const defaultElement = TopNavbarListItemHelpButton;
type Props<E extends React.ElementType> = OwnProps & Omit<SimpleDropdownProps<E>, 'content'>;

const TopNavbarListItemHelpDropdown = <E extends React.ElementType = typeof defaultElement>({
    onOpenShortcutsModal,
    ...rest
}: Props<E>) => {
    const { UID } = useAuthentication();
    const { APP_NAME } = useConfig();
    const { createModal } = useModals();
    const isAuthenticated = !!UID;

    const handleBugReportClick = () => {
        createModal(isAuthenticated ? <AuthenticatedBugModal /> : <BugModal />);
    };

    const handleTourClick = () => {
        createModal(<OnboardingModal showGenericSteps allowClose hideDisplayName />);
    };

    return (
        <SimpleDropdown as={defaultElement} originalPlacement="bottom" hasCaret={false} {...rest}>
            <DropdownMenu>
                <DropdownMenuLink
                    className="flex flex-nowrap text-left"
                    href={
                        APP_NAME === APPS.PROTONVPN_SETTINGS
                            ? 'https://protonvpn.com/support/'
                            : 'https://protonmail.com/support/'
                    }
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                >
                    <Icon className="mt0-25 mr0-5" name="what-is-this" />
                    {c('Action').t`I have a question`}
                </DropdownMenuLink>
                <DropdownMenuLink href="https://protonmail.uservoice.com/" target="_blank">
                    <Icon className="mt0-25 mr0-5" name="help-answer" />
                    {c('Action').t`Request a feature`}
                </DropdownMenuLink>
                <DropdownMenuButton className="flex flex-nowrap text-left" onClick={handleBugReportClick}>
                    <Icon className="mt0-25 mr0-5" name="report-bug" />
                    {c('Action').t`Report bug`}
                </DropdownMenuButton>
                {onOpenShortcutsModal && (
                    <DropdownMenuButton className="flex flex-nowrap text-left" onClick={onOpenShortcutsModal}>
                        <Icon className="mt0-25 mr0-5" name="keyboard" />
                        {c('Action').t`Display keyboard shortcuts`}
                    </DropdownMenuButton>
                )}
                {APP_NAME !== APPS.PROTONVPN_SETTINGS && (
                    <DropdownMenuButton className="flex flex-nowrap text-left" onClick={handleTourClick}>
                        <Icon className="mt0-25 mr0-5" name="tour" />
                        {c('Action').t`${BRAND_NAME} introduction`}
                    </DropdownMenuButton>
                )}
            </DropdownMenu>
        </SimpleDropdown>
    );
};

export default TopNavbarListItemHelpDropdown;