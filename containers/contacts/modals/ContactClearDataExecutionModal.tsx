import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { Alert, DynamicProgress, FormModal } from '../../../components';
import { useContacts } from '../../../hooks';

interface Props {
    onClose?: () => void;
}

const ContactClearDataExecutionModal = ({ onClose = noop, ...rest }: Props) => {
    const [progress, setProgress] = useState(0);
    const [contacts = [], loadingContacts] = useContacts() as [Contact[] | undefined, boolean, Error];

    const max = contacts.length;

    useEffect(() => {
        if (loadingContacts) {
            return;
        }

        console.log('start', contacts, setProgress);
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
