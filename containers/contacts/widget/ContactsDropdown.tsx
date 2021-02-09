import { Recipient } from 'proton-shared/lib/interfaces';
import React, { RefObject, useState } from 'react';
import { c } from 'ttag';
import { Dropdown, SearchInput } from '../../../components';
import { useUser, useUserSettings } from '../../../hooks';
import ContactsList from '../ContactsList';
import useContactList from '../useContactList';

interface Props {
    uid: string;
    isOpen: boolean;
    anchorRef: RefObject<HTMLButtonElement>;
    onClose: () => void;
    onCompose?: (emails: Recipient[]) => void;
}

const ContactsDropdown = ({ uid, isOpen, anchorRef, onClose, onCompose }: Props) => {
    const [user] = useUser();
    const [userSettings] = useUserSettings();

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
    } = useContactList({
        search,
        contactID,
        contactGroupID,
    });

    const handleClick = (contactID: string) => {
        const contactEmails = contactEmailsMap[contactID];

        if (!contactEmails?.length) {
            console.log('TODO contact with no email');
            return;
        }

        const contactEmail = contactEmails[0];

        onCompose?.([{ Name: contactEmail.Name, Address: contactEmail.Email }]);

        onClose();
    };

    const contactsLength = contacts ? contacts.length : 0;

    return (
        <Dropdown
            id={uid}
            isOpen={isOpen}
            anchorRef={anchorRef}
            onClose={onClose}
            originalPlacement="bottom"
            className="contacts-widget"
        >
            <div className="flex flex-column flex-nowrap h100">
                <div className="m1 mb0">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder={c('Placeholder').t`Search for name, email, address or group`}
                    />
                </div>
                <div className="m1">toolbar</div>
                <div className="h100 w100">
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
                        onClick={handleClick}
                    />
                </div>
            </div>
        </Dropdown>
    );
};

export default ContactsDropdown;
