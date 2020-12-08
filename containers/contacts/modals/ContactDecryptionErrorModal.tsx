import React from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { useHistory } from 'react-router';
import { Alert, FormModal, LinkButton } from '../../../components';
import { useModals } from '../../../hooks';
import ContactClearDataConfirmModal from './ContactClearDataConfirmModal';

interface Props {
    onClose?: () => void;
}

const ContactDecryptionErrorModal = ({ onClose = noop, ...rest }: Props) => {
    const { createModal } = useModals();
    const history = useHistory();

    const handleRecover = () => {
        history.push('/settings/security');
        onClose();
    };

    const handleClear = () => {
        createModal(<ContactClearDataConfirmModal />);
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Recover data`}
            onSubmit={() => handleRecover()}
            onClose={onClose}
            submit={c('Action').t`Recover data`}
            className="pm-modal--smaller"
            {...rest}
        >
            <Alert type="info">{c('Info')
                .t`To recover your data, you need to re-activate the contact encryption key used at the time when the data was created. This will require you to remember the password used when the key was generated.`}</Alert>
            <Alert type="info">
                {c('Info')
                    .t`Cannot remember your password? We can help you clear the encrypted data and in the process dismiss the alert.`}
                <LinkButton onClick={handleClear}>{c('Action').t`Click here.`}</LinkButton>
            </Alert>
        </FormModal>
    );
};

export default ContactDecryptionErrorModal;
