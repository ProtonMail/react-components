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

interface Props {
    contactID: string;
}

const ContactModal = ({ contactID, ...rest }: Props) => {
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [contactGroups = [], loadingContactGroups] = useContactGroups();
    const [userKeysList, loadingUserKeys] = useUserKeys();
    const [addresses = [], loadingAddresses] = useAddresses();

    const contactEmailsMap = useMemo(() => {
        if (!Array.isArray(contactEmails)) {
            return {};
        }
        return contactEmails.reduce((acc, contactEmail) => {
            const { ContactID } = contactEmail;
            if (!acc[ContactID]) {
                acc[ContactID] = [];
            }
            acc[ContactID].push(contactEmail);
            return acc;
        }, Object.create(null));
    }, [contactEmails]);

    const ownAddresses = useMemo(() => addresses.map(({ Email }) => Email), [addresses]);
    const contactGroupsMap = useMemo(() => toMap(contactGroups), [contactGroups]);

    return (
        <FormModal
            title={c(`Title`).t`Contact details`}
            loading={loadingContactEmails || loadingContactGroups || loadingUserKeys || loadingAddresses}
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
                    />
                </ErrorBoundary>
            </ContactProvider>
        </FormModal>
    );
};

export default ContactModal;
