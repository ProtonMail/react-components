import React from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Alert, FormModal } from '../../../components';
import { useModals } from '../../../hooks';
import ContactResignExecutionModal from './ContactResignExecutionModal';

interface Props {
    contactID: string;
    onClose?: () => void;
}

const ContactSignatureErrorModal = ({ onClose = noop, contactID, ...rest }: Props) => {
    const { createModal } = useModals();

    const handleSubmit = () => {
        createModal(<ContactResignExecutionModal />);
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Resigning contacts`}
            onSubmit={handleSubmit}
            onClose={onClose}
            submit={c('Action').t`Resign`}
            className="pm-modal--smaller"
            {...rest}
        >
            <Alert type="info">{c('Info').t`Signatures are not valid, do you want to resign your contacts?`}</Alert>
        </FormModal>
    );
};

export default ContactSignatureErrorModal;
