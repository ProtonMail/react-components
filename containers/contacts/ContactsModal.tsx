import React, { useState, MouseEvent } from 'react';
import {
    FormModal,
    SearchInput,
    SimpleTabs,
    useContacts,
    useContactEmails,
    useContactGroups,
    useUser,
    useUserSettings,
    useModals
} from 'react-components';
import { ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';

import ContactsList from './ContactsList';
import useContactsList from './useContactsList';
import ContactModal from './ContactModal';
import ContactModalRow from './ContactModalRow';

const ContactsModal = ({ ...rest }) => {
    const [search, setSearch] = useState<string>('');
    const { createModal } = useModals();
    const [user] = useUser();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [contacts, loadingContacts] = useContacts();
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contactGroups, loadingContactGroups] = useContactGroups();
    const contactGroupsMap = toMap(contactGroups, 'ID') as { [contactGroupID: string]: ContactGroup };
    const loading = loadingContacts || loadingContactEmails || loadingContactGroups || loadingUserSettings;
    const title = c('Title').t`Contact list`;
    const { formattedContacts, onCheck } = useContactsList({
        search,
        contacts,
        contactEmails,
        contactGroups
    });

    const [lastChecked, setLastChecked] = useState<string>(''); // Store ID of the last contact ID checked

    const handleCheck = (e: MouseEvent<HTMLInputElement>, contactID: string) => {
        const { target, nativeEvent } = e;
        const contactIDs = contactID ? [contactID] : [];

        if (lastChecked && nativeEvent.shiftKey) {
            const start = contacts.findIndex(({ ID }) => ID === contactID);
            const end = contacts.findIndex(({ ID }) => ID === lastChecked);
            contactIDs.push(...contacts.slice(Math.min(start, end), Math.max(start, end) + 1).map(({ ID }) => ID));
        }

        if (contactID) {
            setLastChecked(contactID);
            onCheck(contactIDs, target.checked);
        }
    };

    const handleClick = (contactID: string) => {
        createModal(<ContactModal contactID={contactID} />);
    };

    return (
        <FormModal title={title} loading={loading} {...rest}>
            <div className="mb1">
                <SearchInput value={search} onChange={setSearch} />
            </div>
            <SimpleTabs
                tabs={[
                    {
                        title: c('Tab').t`Contacts`,
                        content: (
                            <ContactsList
                                contacts={formattedContacts}
                                userSettings={userSettings}
                                isDesktop={false}
                                rowRenderer={({ index, style, key }) => (
                                    <ContactModalRow
                                        onClick={handleClick}
                                        onCheck={handleCheck}
                                        style={style}
                                        key={key}
                                        user={user}
                                        contact={formattedContacts[index]}
                                        contactGroupsMap={contactGroupsMap}
                                    />
                                )}
                            />
                        )
                    },
                    {
                        title: c('Tab').t`Groups`,
                        content: null
                    }
                ]}
            />
        </FormModal>
    );
};

export default ContactsModal;
