import React, { useState } from 'react';
import { c, msgid } from 'ttag';
import { Recipient } from 'proton-shared/lib/interfaces';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { exportContacts } from 'proton-shared/lib/contacts/export';
import { FullLoader, SearchInput } from '../../../components';
import { useApi, useModals, useNotifications, useUser, useUserKeys, useUserSettings } from '../../../hooks';
import ContactsList from '../ContactsList';
import ContactDetailsModal from '../modals/ContactDetailsModal';
import useContactList from '../useContactList';
import ContactsWidgetToolbar from './ContactsWidgetToolbar';
import { ContactDeleteModal } from '..';
import ContactModal from '../modals/ContactModal';

interface Props {
    onClose: () => void;
    onCompose?: (recipients: Recipient[], attachments: File[]) => void;
}

const ContactsWidgetContainer = ({ onClose, onCompose }: Props) => {
    const [user, loadingUser] = useUser();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [userKeys] = useUserKeys();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const api = useApi();

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
                text: c('Error').t`You can't send a mail to more than 100 recipients`,
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
                msgid`One of the contacts has no email address: ${noEmailsContactNamesList}`,
                `Some contacts have no email address: ${noEmailsContactNamesList} `,
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

        onCompose?.(recipients, []);
        onClose();
    };

    const handleForward = async () => {
        if (selectedIDs.length > 100) {
            createNotification({
                type: 'error',
                text: c('Error').t`You can't send vcards of more than 10 contacts`,
            });
            return;
        }

        const abortController = new AbortController();
        const { success, failures } = await exportContacts(selectedIDs, userKeys, abortController.signal, api);

        if (failures.length) {
            createNotification({
                type: 'error',
                text: c('Error').t`There was an error when exporting the contacts vcards`,
            });
            return;
        }

        const files = success.map(
            (data) => new File([data.vcard], data.name, { type: 'data:text/plain;charset=utf-8;' })
        );

        onCompose?.([], files);
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
            <div className="m1 mb0-25">
                <label htmlFor="id_contact-widget-search" className="sr-only">{c('Placeholder')
                    .t`Search for name or email`}</label>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    id="id_contact-widget-search"
                    placeholder={c('Placeholder').t`Search for name or email`}
                />
            </div>
            <div className="p1 border-bottom">
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
                    <div className="flex h100">
                        <FullLoader className="mauto color-primary" />
                    </div>
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
