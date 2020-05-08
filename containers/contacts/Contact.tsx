import React, { useRef, useEffect, useState } from 'react';

import { Loader } from 'react-components';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { prepareContact, CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { ContactEmail, ContactGroup, ContactProperties } from 'proton-shared/lib/interfaces/contacts/Contact';

import useContact from './useContact';
import ContactView from './ContactView';

type ContactModel = {
    ID: string;
    properties: ContactProperties;
    errors: CryptoProcessingError[];
};

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    userKeysList: CachedKey[];
    ownAddresses: string[];
}

const Contact = ({ contactID, contactEmails, contactGroupsMap, ownAddresses, userKeysList = [] }: Props) => {
    const [model, setModel] = useState<ContactModel>();
    const ref = useRef(contactID);
    const [contact, contactLoading] = useContact(contactID);

    useEffect(() => {
        if (contact && userKeysList.length) {
            ref.current = contact.ID;
            const { publicKeys, privateKeys } = splitKeys(userKeysList);

            prepareContact(contact, { publicKeys, privateKeys }).then(({ properties, errors }) => {
                if (ref.current !== contact.ID) {
                    return;
                }
                setModel({ ID: contact.ID, properties, errors });
            });
        }
    }, [contact, userKeysList]);

    const { properties, errors, ID } = model || {};

    if (contactLoading || !properties || ID !== contactID) {
        return <Loader />;
    }

    return (
        <ContactView
            properties={properties}
            contactID={contactID}
            contactEmails={contactEmails}
            contactGroupsMap={contactGroupsMap}
            ownAddresses={ownAddresses}
            userKeysList={userKeysList}
            errors={errors}
        />
    );
};

export default Contact;
