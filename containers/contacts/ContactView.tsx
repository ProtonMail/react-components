import React from 'react';
import { c } from 'ttag';

import { useModals, PrimaryButton, Button, useUser } from 'react-components';
import { ContactProperties, ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';

import { singleExport } from 'proton-shared/lib/contacts/export';

import ContactModal from './modals/ContactModal';
import ContactViewErrors from './ContactViewErrors';
import ContactSummary from './ContactSummary';
import ContactViewProperties from './ContactViewProperties';
import UpsellFree from '../../components/contacts/UpsellFree';

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    ownAddresses: string[];
    properties: ContactProperties;
    userKeysList: CachedKey[];
    errors: CryptoProcessingError[];
}

const ContactView = ({
    properties = [],
    contactID,
    contactEmails,
    contactGroupsMap,
    ownAddresses,
    userKeysList,
    errors
}: Props) => {
    const { createModal } = useModals();
    const [user] = useUser();

    const openContactModal = () => {
        createModal(<ContactModal properties={properties} contactID={contactID} />);
    };

    const handleExport = () => singleExport(properties);

    return (
        <div className="view-column-detail flex-item-fluid scroll-if-needed">
            <div className="flex flex-spacebetween flex-items-center border-bottom">
                <div className="p1">
                    <h2 className="m0">{c('Title').t`Contact details`}</h2>
                </div>
                <div className="p1">
                    <PrimaryButton onClick={openContactModal} className="mr1">{c('Action').t`Edit`}</PrimaryButton>
                    <Button onClick={handleExport}>{c('Action').t`Export`}</Button>
                </div>
            </div>
            <ContactViewErrors errors={errors} />
            <ContactSummary properties={properties} />
            <div className="pl1 pr1">
                <ContactViewProperties
                    userKeysList={userKeysList}
                    contactID={contactID}
                    contactEmails={contactEmails}
                    contactGroupsMap={contactGroupsMap}
                    ownAddresses={ownAddresses}
                    properties={properties}
                    field="email"
                />
                {user.hasPaidMail ? (
                    <>
                        <ContactViewProperties contactID={contactID} properties={properties} field="tel" />
                        <ContactViewProperties contactID={contactID} properties={properties} field="adr" />
                        <ContactViewProperties contactID={contactID} properties={properties} />
                    </>
                ) : (
                    <UpsellFree />
                )}
            </div>
        </div>
    );
};

export default ContactView;
