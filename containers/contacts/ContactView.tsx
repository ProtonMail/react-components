import React from 'react';
import { CRYPTO_PROCESSING_TYPES } from 'proton-shared/lib/contacts/constants';
import { ContactProperties, ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { DecryptedKey } from 'proton-shared/lib/interfaces';
import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { singleExport } from 'proton-shared/lib/contacts/export';
import { useModals } from '../../hooks';
import ContactSummary from '../../components/contacts/ContactSummary';
import ContactViewProperties from '../../components/contacts/ContactViewProperties';
import { classnames } from '../../helpers';
import ContactModal from './modals/ContactModal';
import ContactDeleteModal from './modals/ContactDeleteModal';
import ContactViewErrors from './ContactViewErrors';
import { Button } from '../../components';

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    ownAddresses: string[];
    properties: ContactProperties;
    userKeysList: DecryptedKey[];
    errors?: CryptoProcessingError[];
    isModal: boolean;
    onDelete: () => void;
    onReload: () => void;
    isPreview?: boolean;
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
    onDelete,
    onReload,
    isPreview = false,
}: Props) => {
    const { createModal } = useModals();

    const handleDelete = () => {
        createModal(<ContactDeleteModal contactIDs={[contactID]} onDelete={onDelete} />);
    };

    const handleEdit = (field?: string) => {
        createModal(<ContactModal properties={properties} contactID={contactID} newField={field} />);
    };

    const handleExport = () => singleExport(properties);

    const hasError = errors?.some((error) => error.type !== CRYPTO_PROCESSING_TYPES.SIGNATURE_NOT_VERIFIED);

    const contactViewPropertiesProps = {
        contactID,
        userKeysList,
        contactEmails,
        ownAddresses,
        properties,
        contactGroupsMap,
        leftBlockWidth: 'label max-w100p',
        rightBlockWidth: 'w100',
    };

    const { hasEmail, hasTel, hasAdr } = properties.reduce<{ hasEmail: boolean; hasTel: boolean; hasAdr: boolean }>(
        (acc, { field }) => {
            acc.hasEmail = acc.hasEmail || field === 'email';
            acc.hasTel = acc.hasTel || field === 'tel';
            acc.hasAdr = acc.hasAdr || field === 'adr';
            return acc;
        },
        {
            hasEmail: false,
            hasTel: false,
            hasAdr: false,
        }
    );

    return (
        <div
            className={classnames([!isModal && 'view-column-detail flex-item-fluid scroll-if-needed p2 on-mobile-p1'])}
        >
            <div className="border-bottom ml1 mr1 pb1 mb1 on-mobile-ml0-5 on-mobile-mr0-5 on-tiny-mobile-ml0">
                <ContactSummary
                    onExport={handleExport}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    properties={properties}
                    leftBlockWidth="w100 max-w100p on-mobile-wauto"
                    isPreview={isPreview}
                    hasError={hasError}
                />
                <ContactViewErrors errors={errors} onReload={onReload} contactID={contactID} />
            </div>
            <div className="pl1 pr1 on-mobile-pl0-5 on-mobile-pr0-5 on-tiny-mobile-pl0">
                <ContactViewProperties field="fn" {...contactViewPropertiesProps} />
                <ContactViewProperties field="email" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties field="tel" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties field="adr" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties {...contactViewPropertiesProps} />
            </div>
            {hasEmail ? null : (
                <div className="mb0-5">
                    <Button shape="outline" color="norm" size="medium" onClick={() => handleEdit('email')}>
                        Add email
                    </Button>
                </div>
            )}
            {hasTel ? null : (
                <div className="mb0-5">
                    <Button shape="outline" color="norm" size="medium" onClick={() => handleEdit('tel')}>
                        Add phone number
                    </Button>
                </div>
            )}
            {hasAdr ? null : (
                <div className="mb0-5">
                    <Button shape="outline" color="norm" size="medium" onClick={() => handleEdit('adr')}>
                        Add address
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ContactView;
