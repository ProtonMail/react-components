import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { getKeyUsedForContact } from 'proton-shared/lib/contacts/keyVerifications';
import { Key } from 'proton-shared/lib/interfaces';
import { APPS } from 'proton-shared/lib/constants';
import { Alert, AppLink, Copy, FormModal, LinkButton, PrimaryButton } from '../../../components';
import { useModals, useUser } from '../../../hooks';
import ContactClearDataConfirmModal from './ContactClearDataConfirmModal';
import useContact from '../useContact';

interface Props {
    contactID: string;
    onClose?: () => void;
}

const ContactDecryptionErrorModal = ({ onClose = noop, contactID, ...rest }: Props) => {
    const { createModal } = useModals();
    const [user] = useUser();
    const [contact] = useContact(contactID) as [Contact | undefined, boolean, Error];
    const [errorKey, setErrorKey] = useState<Key>();

    useEffect(() => {
        const findKey = async () => {
            const key = await getKeyUsedForContact(contact as Contact, user.Keys, true);
            setErrorKey(key);
        };

        if (user && contact) {
            void findKey();
        }
    }, [user, contact]);

    const handleClear = () => {
        createModal(<ContactClearDataConfirmModal errorKey={errorKey as Key} />);
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Recover data`}
            onClose={onClose}
            submit={
                <AppLink toApp={APPS.PROTONMAIL} to="/settings/security">
                    <PrimaryButton type="submit" disabled={!errorKey}>
                        {c('Action').t`Recover data`}
                    </PrimaryButton>
                </AppLink>
            }
            close={c('Action').t`Close`}
            {...rest}
        >
            <Alert type="info">
                {c('Info')
                    .t`To recover your data, you need to re-activate the contact encryption key used at the time when the data was created. This will require you to remember the password used when the key was generated.`}
            </Alert>
            {errorKey && (
                <div className="flex flex-align-items-center mb1">
                    <span className="mr1">{c('Info').t`Key fingerprint`}</span>
                    <span className="flex-item-fluid text-ellipsis mr1">{errorKey.Fingerprint}</span>
                    <Copy className="button--for-icon" value={errorKey.Fingerprint} />
                </div>
            )}
            <Alert type="info">
                {c('Info')
                    .t`Cannot remember your password? We can help you clear the encrypted data and in the process dismiss the alert.`}
                <LinkButton className="ml0-5" onClick={handleClear} disabled={!errorKey}>
                    {c('Action').t`Click here.`}
                </LinkButton>
            </Alert>
        </FormModal>
    );
};

export default ContactDecryptionErrorModal;
