import React, { useState, useEffect, useMemo, useRef } from 'react';
import { c } from 'ttag';

import {
    FormModal,
    ErrorBoundary,
    GenericError,
    useContactEmails,
    useUserKeys,
    useContactGroups,
    useAddresses,
    useModals,
    ContactModal
} from 'react-components';
import { toMap } from 'proton-shared/lib/helpers/object';
import { noop } from 'proton-shared/lib/helpers/function';
import { splitKeys } from 'proton-shared/lib/keys/keys';

import { prepareContact, CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { ContactProperties } from 'proton-shared/lib/interfaces/contacts/Contact';

import Contact from '../ContactContainer';
import useContactList from '../useContactList';
import useContact from '../useContact';

interface Props {
    contactID: string;
    onClose?: () => void;
}

type ContactModel = {
    ID: string;
    properties: ContactProperties;
    errors: CryptoProcessingError[];
};

const ContactDetailsModal = ({ contactID, onClose = noop, ...rest }: Props) => {
    const { createModal } = useModals();
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contacts, loadingContacts] = useContactEmails();
    const [contactGroups = [], loadingContactGroups] = useContactGroups();
    const [userKeysList, loadingUserKeys] = useUserKeys();
    const [addresses = [], loadingAddresses] = useAddresses();
    const { contactEmailsMap } = useContactList({ contactEmails, contacts });
    const ref = useRef(contactID);

    /* @todo move that to a useContactProperties hook to be reused in Contact.tsx */
    const [model, setModel] = useState<ContactModel>();

    const [contact] = useContact(contactID);

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

    const { properties = [] } = model || {};

    const openContactModal = () => {
        createModal(<ContactModal properties={properties} contactID={contactID} />);
        onClose();
    };

    const ownAddresses = useMemo(() => addresses.map(({ Email }) => Email), [addresses]);
    const contactGroupsMap = useMemo(() => toMap(contactGroups), [contactGroups]);

    const isLoading =
        loadingContactEmails || loadingContactGroups || loadingUserKeys || loadingAddresses || loadingContacts;

    return (
        <FormModal
            title={c(`Title`).t`Contact details`}
            loading={isLoading}
            close={c('Action').t`Cancel`}
            submit={c('Action').t`Edit`}
            disabled
            onSubmit={openContactModal}
            onClose={onClose}
            {...rest}
        >
            <ErrorBoundary
                key={contactID}
                component={<GenericError className="pt2 view-column-detail flex-item-fluid" />}
            >
                <Contact
                    contactID={contactID}
                    contactEmails={contactEmailsMap[contactID]}
                    contactGroupsMap={contactGroupsMap}
                    ownAddresses={ownAddresses}
                    userKeysList={userKeysList}
                    showHeader={false}
                />
            </ErrorBoundary>
        </FormModal>
    );
};

export default ContactDetailsModal;
