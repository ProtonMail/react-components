import React from 'react';
import PropTypes from 'prop-types';
import { Alert, FormModal, PrimaryButton, Button, ResetButton } from 'react-components';
import { c } from 'ttag';

const RequestNewCodeModal = ({ email, onEdit, onResend, ...rest }) => {
    return (
        <FormModal
            title={c('Title').t`Request new verification code`}
            footer={
                <>
                    <ResetButton>{c('Action').t`Cancel`}</ResetButton>
                    <div>
                        <Button
                            onClick={() => {
                                rest.onClose();
                                onEdit();
                            }}
                        >{c('Action').t`Edit`}</Button>
                        <PrimaryButton
                            onClick={() => {
                                rest.onClose();
                                onResend();
                            }}
                        >{c('Action').t`Resend new code`}</PrimaryButton>
                    </div>
                </>
            }
        >
            <Alert>{c('Info')
                .jt`Click "Request new code" to have a new verification code sent to <${email}>. If this email address is incorrect, click "Edit" to correct it.`}</Alert>
        </FormModal>
    );
};

RequestNewCodeModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired
};

export default RequestNewCodeModal;
