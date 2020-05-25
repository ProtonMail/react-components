import React from 'react';

import { useModals, classnames, ContactDeleteModal } from 'react-components';
import { ContactProperties, ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { singleExport } from 'proton-shared/lib/contacts/export';

import ContactModal from './modals/ContactModal';
import ContactViewErrors from './ContactViewErrors';
import ContactSummary from '../../components/contacts/ContactSummary';
import ContactViewProperties from '../../components/contacts/ContactViewProperties';

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    ownAddresses: string[];
    properties: ContactProperties;
    userKeysList: CachedKey[];
    errors?: CryptoProcessingError[];
    isModal: boolean;
    onDelete: () => void;
}

const ContactView = ({
    properties = [],
    contactID,
    contactEmails,
    contactGroupsMap,
    ownAddresses,
    userKeysList,
    errors,
    isModal,
    onDelete
}: Props) => {
    const { createModal } = useModals();

    const handleDelete = () => {
        createModal(<ContactDeleteModal contactIDs={[contactID]} onDelete={onDelete} />);
    };

    const handleEdit = (field?: string) => {
        createModal(<ContactModal properties={properties} contactID={contactID} newField={field} />);
    };

    const handleExport = () => singleExport(properties);

    const contactViewPropertiesProps = {
        contactID,
        userKeysList,
        contactEmails,
        ownAddresses,
        properties,
        contactGroupsMap,
        leftBlockWidth: 'w100 mw100p',
        rightBlockWidth: 'w100'
    };

    return (
        <div className={classnames([!isModal && 'view-column-detail flex-item-fluid'])}>
            <ContactViewErrors errors={errors} />
            <ContactSummary
                handleExport={handleExport}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                properties={properties}
                leftBlockWidth="w100 mw100p"
            />
            <div className="pl1 pr1">
                <ContactViewProperties field="fn" {...contactViewPropertiesProps} />
                <ContactViewProperties field="email" {...contactViewPropertiesProps} />
                <ContactViewProperties field="tel" {...contactViewPropertiesProps} />
                <ContactViewProperties field="adr" {...contactViewPropertiesProps} />
                <ContactViewProperties {...contactViewPropertiesProps} />
            </div>
        </div>
    );
};

export default ContactView;
