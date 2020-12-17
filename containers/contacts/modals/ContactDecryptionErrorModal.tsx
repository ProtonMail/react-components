import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { useHistory } from 'react-router';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { getKeyUsedForContact } from 'proton-shared/lib/contacts/keyVerifications';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { getAppHref } from 'proton-shared/lib/apps/helper';
import { APPS } from 'proton-shared/lib/constants';
import { Alert, FormModal, LinkButton, PrimaryButton, Table, TableBody, TableRow } from '../../../components';
import { useModals, useUserKeys } from '../../../hooks';
import ContactClearDataConfirmModal from './ContactClearDataConfirmModal';
import useContact from '../useContact';

interface Props {
    contactID: string;
    onClose?: () => void;
}

const ContactDecryptionErrorModal = ({ onClose = noop, contactID, ...rest }: Props) => {
    const { createModal } = useModals();
    const history = useHistory();
    const [userKeys] = useUserKeys();
    const [contact] = useContact(contactID) as [Contact | undefined, boolean, Error];
    const [errorKey, setErrorKey] = useState<CachedKey>();

    useEffect(() => {
        const findKey = async () => {
            const key = await getKeyUsedForContact(contact as Contact, userKeys, true);
            setErrorKey(key);
        };

        if (userKeys && userKeys.length > 0 && contact) {
            void findKey();
        }
    }, [userKeys, contact]);

    const handleRecover = () => {
        history.push(getAppHref('/settings/security', APPS.PROTONMAIL));
        onClose();
    };

    const handleClear = () => {
        createModal(<ContactClearDataConfirmModal errorKey={errorKey as CachedKey} />);
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Recover data`}
            onSubmit={() => handleRecover()}
            onClose={onClose}
            submit={
                <PrimaryButton type="submit" disabled={!errorKey}>
                    {c('Action').t`Recover data`}
                </PrimaryButton>
            }
            {...rest}
        >
            <Alert type="info">
                {c('Info')
                    .t`To recover your data, you need to re-activate the contact encryption key used at the time when the data was created. This will require you to remember the password used when the key was generated.`}
            </Alert>
            {errorKey && (
                <Table className="pm-simple-table">
                    <thead>
                        <tr>
                            <th scope="col" className="ellipsis">{c('Table header').t`Fingerprint`}</th>
                        </tr>
                    </thead>
                    <TableBody>
                        <TableRow
                            key={errorKey.Key.Fingerprint}
                            cells={[
                                <div key="fingerprint" title={errorKey.Key.Fingerprint} className="flex flex-nowrap">
                                    <span className="flex-item-fluid ellipsis aligncenter">
                                        {errorKey.Key.Fingerprint}
                                    </span>
                                </div>,
                            ]}
                        />
                    </TableBody>
                </Table>
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
