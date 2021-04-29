import React, { useState } from 'react';
import { c } from 'ttag';
import { Recipient, SimpleMap } from 'proton-shared/lib/interfaces';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { Dropdown, DropdownButton, Icon, Tabs, usePopperAnchor } from '../../../components';
import { useModals } from '../../../hooks';
import { generateUID } from '../../../helpers';
import ContactsWidgetContainer from './ContactsWidgetContainer';
import ContactsWidgetGroupsContainer from './ContactsWidgetGroupsContainer';
import ContactsWidgetSettingsContainer from './ContactsWidgetSettingsContainer';
import './ContactsWidget.scss';
import TopNavbarListItemButton, {
    TopNavbarListItemButtonProps,
} from '../../../components/topnavbar/TopNavbarListItemButton';
import ImportContactsModal from '../import/ImportContactsModal';
import useContactList from '../useContactList';

const TopNavbarListItemContactsButton = React.forwardRef(
    (props: Omit<TopNavbarListItemButtonProps<'button'>, 'icon' | 'text' | 'as'>, ref: typeof props.ref) => {
        return (
            <TopNavbarListItemButton
                {...props}
                ref={ref}
                as="button"
                type="button"
                icon={<Icon name="contacts" />}
                text={c('Header').t`Contacts`}
            />
        );
    }
);

enum CONTACT_WIDGET_TABS {
    CONTACTS,
    GROUPS,
}

interface CustomAction {
    onClick: ({
        contactList,
    }: {
        contactList?: ReturnType<typeof useContactList>;
        groupsEmailsMap?: SimpleMap<ContactEmail[]>;
        recipients?: Recipient[];
    }) => (event: React.MouseEvent<HTMLButtonElement>) => void;
    title: string;
    icon: string;
    tabs: CONTACT_WIDGET_TABS[];
}

interface Props {
    className?: string;
    onCompose?: (emails: Recipient[], attachments: File[]) => void;
    customActions?: CustomAction[];
}

const TopNavbarListItemContactsDropdown = ({ className, onCompose, customActions = [] }: Props) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();
    const [tabIndex, setTabIndex] = useState(0);
    const { createModal } = useModals();

    const handleClose = () => {
        setTabIndex(0);
        close();
    };

    const handleClickDropdownButton = () => {
        if (isOpen) {
            handleClose();
        } else {
            toggle();
        }
    };

    const handleImport = () => {
        createModal(<ImportContactsModal />);
        handleClose();
    };

    const actionIncludes = (tab: CONTACT_WIDGET_TABS) => (customAction: CustomAction) =>
        customAction.tabs.includes(tab);

    return (
        <>
            <DropdownButton
                as={TopNavbarListItemContactsButton}
                isOpen={isOpen}
                className={className}
                ref={anchorRef}
                onClick={handleClickDropdownButton}
            >
                <></>
            </DropdownButton>
            <Dropdown
                id={uid}
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={handleClose}
                autoClose={false}
                originalPlacement="bottom"
                className="contacts-widget"
                noMaxWidth
                noMaxHeight
            >
                <Tabs
                    className="flex flex-column flex-nowrap"
                    containerClassName="contacts-widget-tabs flex-item-noshrink"
                    contentClassNane="flex-item-fluid"
                    tabs={[
                        {
                            title: c('Title').t`Contacts`,
                            content: (
                                <ContactsWidgetContainer
                                    onClose={handleClose}
                                    onCompose={onCompose}
                                    onImport={handleImport}
                                    customActions={customActions.filter(actionIncludes(CONTACT_WIDGET_TABS.CONTACTS))}
                                />
                            ),
                        },
                        {
                            title: c('Title').t`Groups`,
                            content: (
                                <ContactsWidgetGroupsContainer
                                    onClose={handleClose}
                                    onCompose={onCompose}
                                    customActions={customActions.filter(actionIncludes(CONTACT_WIDGET_TABS.GROUPS))}
                                />
                            ),
                        },
                        {
                            title: c('Title').t`Settings`,
                            content: <ContactsWidgetSettingsContainer onClose={handleClose} onImport={handleImport} />,
                        },
                    ]}
                    value={tabIndex}
                    onChange={setTabIndex}
                />
            </Dropdown>
        </>
    );
};

export default TopNavbarListItemContactsDropdown;
