import React, { useState } from 'react';
import { c, msgid } from 'ttag';
import { Recipient } from 'proton-shared/lib/interfaces';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { FullLoader, SearchInput } from '../../../components';
import { useModals, useNotifications, useUser, useUserSettings } from '../../../hooks';
import ContactsList from '../ContactsList';
import ContactDetailsModal from '../modals/ContactDetailsModal';
import useContactList from '../useContactList';
import ContactsWidgetToolbar from './ContactsWidgetToolbar';
import { ContactDeleteModal } from '..';
import ContactModal from '../modals/ContactModal';

interface Props {
    onClose: () => void;
    onCompose?: (recipients: Recipient[]) => void;
}

const ContactsWidgetContainer = ({ onClose, onCompose }: Props) => {
    const [user, loadingUser] = useUser();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();

    const [search, setSearch] = useState('');

    // There is no contact "opened" in the widget
    const contactID = '';

    // To use when the widget will deal with groups
    const contactGroupID = '';

    const {
        formattedContacts,
        checkedIDs,
        contacts,
        contactGroupsMap,
        totalContactsInGroup,
        handleCheck,
        handleCheckOne,
        contactEmailsMap,
        selectedIDs,
        handleCheckAll,
        filteredContacts,
        hasCheckedAllFiltered,
        loading: loadingContacts,
    } = useContactList({
        search,
        contactID,
        contactGroupID,
    });

    const handleCompose = () => {
        if (selectedIDs.length > 100) {
            createNotification({
                type: 'error',
                text: c('Error').t`You can't send a mail to more that 100 recipients`,
            });
            return;
        }

        const noEmailsContactIDs = selectedIDs.filter((contactID) => !contactEmailsMap[contactID]?.length);

        if (noEmailsContactIDs.length) {
            const noEmailsContactNames = noEmailsContactIDs.map(
                // Looping in all contacts is no really performant but should happen rarely
                (contactID) => contacts.find((contact) => contact.ID === contactID)?.Name
            );

            const noEmailsContactNamesCount = noEmailsContactNames.length;
            const noEmailsContactNamesList = noEmailsContactNames.join(', ');

            const text = c('Error').ngettext(
                msgid`${noEmailsContactNamesList} has no email address`,
                `${noEmailsContactNamesList} have no email address`,
                noEmailsContactNamesCount
            );

            createNotification({ type: 'error', text });
            return;
        }

        const contactEmailsOfContacts = selectedIDs.map((contactID) => contactEmailsMap[contactID]) as ContactEmail[][];
        const recipients = contactEmailsOfContacts.map((contactEmails) => {
            const contactEmail = contactEmails[0];
            return { Name: contactEmail.Name, Address: contactEmail.Email };
        });

        onCompose?.(recipients);
        onClose();
    };

    const handleForward = () => {
        console.log('TODO');
        onClose();
    };

    const handleDetails = (contactID: string) => {
        createModal(<ContactDetailsModal contactID={contactID} />);
        onClose();
    };

    const handleDelete = () => {
        const deleteAll = selectedIDs.length === contacts.length;
        createModal(
            <ContactDeleteModal
                contactIDs={selectedIDs}
                deleteAll={deleteAll}
                onDelete={() => {
                    if (selectedIDs.length === filteredContacts.length) {
                        setSearch('');
                    }
                    handleCheckAll(false);
                }}
            />
        );
        onClose();
    };

    const handleCreate = () => {
        createModal(<ContactModal onAdd={() => setSearch('')} />);
        onClose();
    };

    const contactsLength = contacts ? contacts.length : 0;
    const loading = loadingContacts || loadingUser || loadingUserSettings;

    return (
        <div className="flex flex-column flex-nowrap h100">
            <div className="m1 mb0">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={c('Placeholder').t`Search for name or email`}
                />
            </div>
            <div className="m1">
                <ContactsWidgetToolbar
                    allChecked={hasCheckedAllFiltered}
                    oneSelected={!!selectedIDs.length}
                    onCheckAll={handleCheckAll}
                    onCompose={handleCompose}
                    onForward={handleForward}
                    onCreate={handleCreate}
                    onDelete={handleDelete}
                />
            </div>
            <div className="h100 w100">
                {loading ? (
                    <FullLoader />
                ) : (
                    <ContactsList
                        contactID={contactID}
                        contactGroupID={contactGroupID}
                        totalContacts={contactsLength}
                        totalContactsInGroup={totalContactsInGroup}
                        contacts={formattedContacts}
                        contactGroupsMap={contactGroupsMap}
                        user={user}
                        userSettings={userSettings}
                        onCheckOne={handleCheckOne}
                        onClearSearch={() => setSearch('')}
                        isDesktop={false}
                        checkedIDs={checkedIDs}
                        onCheck={handleCheck}
                        onClick={handleDetails}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactsWidgetContainer;
