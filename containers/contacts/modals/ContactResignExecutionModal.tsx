import React, { useEffect, useRef, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { resignAllContacts } from 'proton-shared/lib/contacts/globalOperations';
import { Alert, DynamicProgress, FormModal, PrimaryButton } from '../../../components';
import { useApi, useContacts, useEventManager, useUserKeys } from '../../../hooks';

interface Props {
    onClose?: () => void;
}

const ContactResignExecutionModal = ({ onClose = noop, ...rest }: Props) => {
    const [contacts = [], loadingContacts] = useContacts() as [Contact[] | undefined, boolean, Error];
    const [userKeys] = useUserKeys();
    const api = useApi();
    const { call } = useEventManager();

    const [progress, setProgress] = useState(0);
    const [updated, setUpdated] = useState(0);
    const [closing, setClosing] = useState(false);
    const [execution, setExecution] = useState(true);
    const exitRef = useRef(false);

    const max = contacts.length;

    useEffect(() => {
        if (loadingContacts) {
            return;
        }

        const execute = async () => {
            await resignAllContacts(
                contacts,
                userKeys,
                api,
                (progress, update) => {
                    setProgress(progress);
                    setUpdated(update);
                },
                exitRef
            );
            await call();
            setExecution(false);
        };

        void execute();
    }, [loadingContacts]);

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
            {...rest}
        >
            <Alert type="info">{c('Info')
                .t`This process may take some time depending on the amount of contacts that contained data encrypted with the key.`}</Alert>
            <DynamicProgress
                id="clear-data-execution-progress"
                value={progress}
                display={
                    execution
                        ? c('Info').t`Resigning contact ${progress}/${max}. ${updated} updated. Please wait...`
                        : c('Info').t`All your contacts have been resigned.`
                }
                max={max}
                loading={execution}
            />
        </FormModal>
    );
};

export default ContactResignExecutionModal;
