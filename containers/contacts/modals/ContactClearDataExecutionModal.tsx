import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { dropDataEncryptedWithAKey } from 'proton-shared/lib/contacts/globalOperations';
import { Alert, DynamicProgress, FormModal } from '../../../components';
import { useApi, useContacts, useEventManager } from '../../../hooks';

interface Props {
    errorKey: CachedKey;
    onClose?: () => void;
}

const ContactClearDataExecutionModal = ({ onClose = noop, errorKey, ...rest }: Props) => {
    const [progress, setProgress] = useState(0);
    const [contacts = [], loadingContacts] = useContacts() as [Contact[] | undefined, boolean, Error];
    const api = useApi();
    const { call } = useEventManager();

    const max = contacts.length;

    useEffect(() => {
        if (loadingContacts) {
            return;
        }

        const execution = async () => {
            await dropDataEncryptedWithAKey(contacts, errorKey, api, (index) => setProgress(index));
            await call();
            onClose();
        };

        void execution();
    }, [loadingContacts]);

    return (
        <FormModal
            title={c('Title').t`Clearing data`}
            onSubmit={onClose}
            onClose={onClose}
            submit={c('Action').t`Done`}
            className="pm-modal--smaller"
            {...rest}
        >
            <Alert type="info">{c('Info')
                .t`This process may take some time depending on the amount of contacts that contained data encrypted with the key.`}</Alert>
            <DynamicProgress
                id="clear-data-execution-progress"
                value={progress}
                display={c('Info').t`Clearing data from ${progress}/${max}. Please wait...`}
                max={max}
                loading
            />
        </FormModal>
    );
};

export default ContactClearDataExecutionModal;
