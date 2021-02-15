import React from 'react';
import { c } from 'ttag';

import { KTInfo, KT_STATUS } from 'key-transparency-web-client';
import FormModal from '../../../components/modal/FormModal';
import { useModals, useUserKeys } from '../../../hooks';
import ContactEmailSettingsModal from '../../contacts/modals/ContactEmailSettingsModal';
import useContactProperties from '../../contacts/useContactProperties';
import useContact from '../../contacts/useContact';
import KTKeysTable from './KTKeysTable';
import { Alert } from '../../../components/alert';
import { Paragraph } from '../../../components/paragraph';
import { Info } from '../../../components/link';

interface Props {
    emailAddress: string;
    position: 'composer' | 'received';
    publicKeyKTInfo: KTInfo;
    contactID?: string;
}

function getKTMessage(
    position: string,
    ktOutcome: KT_STATUS
): {
    topParagraph: string;
    bottomParagraph: string;
    alertKT: 'info' | 'error' | 'warning' | 'success' | undefined;
} {
    let topParagraph = '';
    switch (position) {
        case 'composer':
            topParagraph = c('Info').t`This email will be sent encrypted and signed using the keys below.`;
            if (ktOutcome === KT_STATUS.KT_PASSED) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`We verified that the above public keys are in Key Transparency.
                        This means that you are seeing the same public keys as them.
                        This makes sure that nobody else can read this email.`,
                    alertKT: 'success',
                };
            }
            if (ktOutcome === KT_STATUS.KT_FAILED) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`Verification of the above public keys with Key Transparency failed.
                        This means that you might not be seeing the same public keys as them.
                        This means that this email might not be securely encrypted.`,
                    alertKT: 'error',
                };
            }
            if (ktOutcome === KT_STATUS.KTERROR_ADDRESS_NOT_IN_KT) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`The recipient's email address is not in Key Transparency.
                        This means we couldn't verify the above public keys.`,
                    alertKT: 'warning',
                };
            }
            if (ktOutcome === KT_STATUS.KTERROR_MINEPOCHID_NULL) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info')
                        .t`The recipient's email address is in Key Transparency but their public keys have recently changed.
                        This means we couldn't verify the above public keys.`,
                    alertKT: 'warning',
                };
            }
            break;
        case 'received':
            topParagraph = c('Info').t`This email was sent encrypted and signed using the keys below.`;
            if (ktOutcome === KT_STATUS.KT_PASSED) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`We verified that the above public keys are in Key Transparency.
                    This means that you are seeing the same public keys as them.
                    This makes sure that nobody else could have sent this email.`,
                    alertKT: 'success',
                };
            }
            if (ktOutcome === KT_STATUS.KT_FAILED) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`Verification of the above public keys with Key Transparency failed.
                        This means that you might not be seeing the same public keys as them.
                        This means that the sender of this email cannot be verified.`,
                    alertKT: 'error',
                };
            }
            if (ktOutcome === KT_STATUS.KTERROR_ADDRESS_NOT_IN_KT) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info').t`The recipient's email address is not in Key Transparency.
                        This means we couldn't verify the above public keys.`,
                    alertKT: 'warning',
                };
            }
            if (ktOutcome === KT_STATUS.KTERROR_MINEPOCHID_NULL) {
                return {
                    topParagraph,
                    bottomParagraph: c('Info')
                        .t`The recipient's email address is in Key Transparency but their public keys have recently changed.
                        This means we couldn't verify the above public keys.`,
                    alertKT: 'warning',
                };
            }
            break;
        default:
    }
    return { topParagraph: '', bottomParagraph: '', alertKT: undefined };
}

const KTModalContact = ({ emailAddress, position, publicKeyKTInfo, contactID, ...rest }: Props) => {
    const { createModal } = useModals();
    const [userKeysList, loadingUserKeys] = useUserKeys();
    const [contact, contactLoading] = useContact(contactID || '');
    const { properties } = useContactProperties({ contact, userKeysList });
    const property = properties?.find((property) => {
        return property.field === 'email' && property.value === emailAddress;
    });

    const isLoading = loadingUserKeys || contactLoading;
    const submit = property && properties ? c('Action').t`Settings` : null;
    const handleSubmit = () => {
        if (contactID && property && properties) {
            createModal(
                <ContactEmailSettingsModal
                    userKeysList={userKeysList}
                    contactID={contactID}
                    emailProperty={property}
                    properties={properties}
                />
            );
        }
    };

    const { topParagraph, bottomParagraph, alertKT } = getKTMessage(position, publicKeyKTInfo.code);

    return (
        <FormModal
            title={c(`Title`).t`Encryption details`}
            submit={submit}
            loading={isLoading}
            onSubmit={handleSubmit}
            close={c('Action').t`Close`}
            {...rest}
        >
            <Alert type="info" learnMore="https://protonmail.com/support/knowledge-base/how-to-use-pgp/">
                {topParagraph}
            </Alert>
            <Paragraph>
                {c('Label').t`Public keys`}
                <Info
                    className="ml0-5"
                    title={c('Tooltip').t`Public keys are used to send end-to-end encrypted emails to this address`}
                />
            </Paragraph>
            <KTKeysTable emailAddress={emailAddress} />
            <Alert type={alertKT} learnMore="https://protonmail.com/support/knowledge-base/key-transparency/">
                {bottomParagraph}
            </Alert>
        </FormModal>
    );
};

export default KTModalContact;
