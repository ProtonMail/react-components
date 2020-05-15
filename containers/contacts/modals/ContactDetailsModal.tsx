import React, { useMemo } from 'react';
import { c } from 'ttag';

import {
    FormModal,
    ErrorBoundary,
    GenericError,
    useContactEmails,
    useUserKeys,
    useContactGroups,
    useAddresses
} from 'react-components';
import { toMap } from 'proton-shared/lib/helpers/object';

import ContactProvider from '../ContactProvider';
import Contact from '../Contact';
import useContactList from '../useContactList';

interface Props {
    contactID: string;
}

const ContactDetailsModal = ({ contactID, ...rest }: Props) => {
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contacts, loadingContacts] = useContactEmails();
    const [contactGroups = [], loadingContactGroups] = useContactGroups();
    const [userKeysList, loadingUserKeys] = useUserKeys();
    const [addresses = [], loadingAddresses] = useAddresses();
    const { contactEmailsMap } = useContactList({ contactEmails, contacts });

    const openContactModal = () => {
        // createModal(<ContactModal properties={properties} contactID={contactID} />);
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
            {...rest}
        >
            <ContactProvider>
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
            </ContactProvider>
        </FormModal>
    );
};

export default ContactDetailsModal;
