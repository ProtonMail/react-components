import React, { useState, ChangeEvent, useEffect } from 'react';
import {
    FormModal,
    SearchInput,
    SimpleTabs,
    useContacts,
    useContactEmails,
    useContactGroups,
    // useUser,
    useUserSettings
    // useModals
} from 'react-components';
import { ContactFormatted /*, ContactGroup */ } from 'proton-shared/lib/interfaces/contacts/Contact';
// import { toMap } from 'proton-shared/lib/helpers/object';
import { c, msgid } from 'ttag';

import ContactList from './ContactList';
// import ContactModal from './ContactModal';
import ContactListModalRow from './ContactListModalRow';
import useContactList from './useContactList';

const ContactListModal = ({ ...rest }) => {
    const [search, setSearch] = useState('');
    const [checkedFormattedContacts, setCheckedFormattedContacts] = useState<ContactFormatted[]>([]);
    // const { createModal } = useModals();
    // const [user] = useUser();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [contacts, loadingContacts] = useContacts();
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contactGroups, loadingContactGroups] = useContactGroups();
    // const contactGroupsMap = toMap(contactGroups, 'ID') as { [contactGroupID: string]: ContactGroup };
    const loading = loadingContacts || loadingContactEmails || loadingContactGroups || loadingUserSettings;
    const { formattedContacts, onCheck, checkedContacts } = useContactList({
        search,
        contacts,
        contactEmails,
        contactGroups
    });

    const [lastChecked, setLastChecked] = useState<string>(''); // Store ID of the last contact ID checked

    const handleCheck = (e: ChangeEvent<HTMLInputElement>, contactID: string) => {
        const {
            target,
            nativeEvent
        }: {
            target: EventTarget & HTMLInputElement;
            nativeEvent: Event & { shiftKey?: boolean };
        } = e;
        const contactIDs = contactID ? [contactID] : [];

        if (lastChecked && nativeEvent.shiftKey) {
            const start = contacts.findIndex(({ ID }: { ID: string }) => ID === contactID);
            const end = contacts.findIndex(({ ID }: { ID: string }) => ID === lastChecked);
            contactIDs.push(
                ...contacts.slice(Math.min(start, end), Math.max(start, end) + 1).map(({ ID }: { ID: string }) => ID)
            );
        }

        if (contactID) {
            setLastChecked(contactID);
            onCheck(contactIDs, target.checked);
        }
    };

    // const handleClick = (contactID: string) => {
    // createModal(<ContactModal contactID={contactID} />);
    // };

    const handleSearch = (value: string) => setSearch(value);

    const handleSubmit = () => {
        // console.log(checkedFormattedContacts);
    };

    useEffect(() => {
        const x = formattedContacts.filter((c) => c.isChecked);
        setCheckedFormattedContacts(x);
    }, [checkedContacts]);

    return (
        <FormModal
            title={c('Title').t`Contact list`}
            loading={loading}
            disabled={!checkedFormattedContacts.length}
            onSubmit={handleSubmit}
            submit={c('Action').ngettext(
                msgid`Insert contact`,
                `Insert ${checkedFormattedContacts.length} contacts`,
                checkedFormattedContacts.length | 1
            )}
            {...rest}
        >
            <SimpleTabs
                tabs={[
                    {
                        title: c('Tab').t`Contacts`,
                        content: (
                            <>
                                <div className="mb1">
                                    <SearchInput value={search} onChange={handleSearch} placeholder="Search Contacts" />
                                </div>
                                <ContactList
                                    contacts={formattedContacts}
                                    userSettings={userSettings}
                                    isDesktop={false}
                                    rowRenderer={({ index, style }) => (
                                        <ContactListModalRow
                                            // onClick={handleClick}
                                            onCheck={handleCheck}
                                            style={style}
                                            // user={user}
                                            key={formattedContacts[index].ID}
                                            contact={formattedContacts[index]}
                                            // contactGroupsMap={contactGroupsMap}
                                        />
                                    )}
                                />
                            </>
                        )
                    },
                    {
                        title: c('Tab').t`Groups`,
                        content: (
                            <>
                                <div className="mb1">
                                    <SearchInput
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search Contact Groups"
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 300
                                    }}
                                >
                                    Group list goes here
                                </div>
                            </>
                        )
                    }
                ]}
            />
        </FormModal>
    );
};

export default ContactListModal;
