import React, { useState } from 'react';
import {
    FormModal,
    SearchInput,
    useContacts,
    useContactEmails,
    useContactGroups,
    useUser,
    useUserSettings,
    useUserKeys
} from 'react-components';
import { c } from 'ttag';

import ContactsList from './ContactsList';
import useContactsList from './useContactsList';

const ContactsModal = ({ ...rest }) => {
    const [search, setSearch] = useState<string>('');
    const [contactID, setContactID] = useState();
    const [contactGroupID, setContactGroupID] = useState();
    const [user] = useUser();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [userKeysList, loadingUserKeys] = useUserKeys(user);
    const [contacts, loadingContacts] = useContacts();
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contactGroups, loadingContactGroups] = useContactGroups();
    const contactsLength = contacts ? contacts.length : 0;
    const loading = loadingContacts || loadingContactEmails || loadingContactGroups || loadingUserSettings;
    const title = c('Title').t`Contact list`;
    const { formattedContacts, onCheck, onUncheckAll } = useContactsList({
        search,
        contacts,
        contactEmails,
        contactGroups,
        contactGroupID
    });

    return (
        <FormModal title={title} loading={loading} {...rest}>
            <div className="mb1">
                <SearchInput value={search} onChange={setSearch} />
            </div>
            <ContactsList
                user={user}
                userSettings={userSettings}
                userKeysList={userKeysList}
                emptyAddressBook={!contactsLength}
                contactID={contactID}
                contactGroupID={contactGroupID}
                totalContacts={contactsLength}
                contacts={formattedContacts}
                loadingUserKeys={loadingUserKeys}
                onCheck={onCheck}
                onClearSearch={() => setSearch('')}
                onClearSelection={onUncheckAll}
                isDesktop={false}
            />
        </FormModal>
    );
};

export default ContactsModal;
