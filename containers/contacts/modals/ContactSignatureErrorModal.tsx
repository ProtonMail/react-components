import React, { useEffect, useRef, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { getKeyUsedForContact } from 'proton-shared/lib/contacts/keyVerifications';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { resignWithAKey } from 'proton-shared/lib/contacts/globalOperations';
import { Alert, DynamicProgress, FormModal, PrimaryButton } from '../../../components';
import { useApi, useContacts, useEventManager, useUserKeys } from '../../../hooks';
import useContact from '../useContact';

interface Props {
    contactID: string;
    onClose?: () => void;
}

const ContactSignatureErrorModal = ({ onClose = noop, contactID, ...rest }: Props) => {
    const [contacts = [], loadingContacts] = useContacts() as [Contact[] | undefined, boolean, Error];
    const [userKeys] = useUserKeys();
    const api = useApi();
    const { call } = useEventManager();
    const [contact, loadingContact] = useContact(contactID) as [Contact | undefined, boolean, Error];

    const [progress, setProgress] = useState(0);
    const [closing, setClosing] = useState(false);
    const [execution, setExecution] = useState(true);
    const exitRef = useRef(false);

    const max = contacts.length;

    useEffect(() => {
        if (loadingContact || loadingContacts) {
            return;
        }

        const execute = async () => {
            const key = await getKeyUsedForContact(contact as Contact, userKeys, false);
            await resignWithAKey(contacts, key as CachedKey, userKeys[0], api, (index) => setProgress(index), exitRef);
            await call();
            setExecution(false);
        };

        void execute();
    }, [loadingContact, loadingContacts]);

    // Delayed closing no to leave ongoing process
    useEffect(() => {
        if (closing && !execution) {
            onClose();
        }
    }, [closing, execution]);

    const handleClose = () => {
        exitRef.current = true;
        setClosing(true);
    };

    return (
        <FormModal
            title={c('Title').t`Resigning contacts`}
            onSubmit={onClose}
            onClose={handleClose}
            submit={
                <PrimaryButton disabled={execution} type="submit" data-focus-fallback="-1">
                    {c('Action').t`Done`}
                </PrimaryButton>
            }
            className="pm-modal--smaller"
            {...rest}
        >
            <Alert type="info">{c('Info')
                .t`This process may take some time depending on the amount of contacts that contained data encrypted with the key.`}</Alert>
            <DynamicProgress
                id="clear-data-execution-progress"
                value={progress}
                display={
                    execution
                        ? c('Info').t`Resigning contact ${progress}/${max}. Please wait...`
                        : c('Info').t`All your contacts have been resigned.`
                }
                max={max}
                loading={execution}
            />
        </FormModal>
    );
};

export default ContactSignatureErrorModal;
