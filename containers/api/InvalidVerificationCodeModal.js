import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal, Button, PrimaryButton, Alert } from 'react-components';
import { c } from 'ttag';

const InvalidVerificationCodeModal = ({
    onEdit,
    onResend,
    edit = c('Action').t`Try other method`,
    request = c('Action').t`Request new code`,
    ...rest
}) => {
    return (
        <ConfirmModal
            title={c('Title').t`Invalid verification code`}
            footer={
                <>
                    <Button
                        className="mr1"
                        onClick={() => {
                            rest.onClose();
                            onEdit();
                        }}
                    >
                        {edit}
                    </Button>
                    <PrimaryButton
                        onClick={() => {
                            rest.onClose();
                            onResend();
                        }}
                    >
                        {request}
                    </PrimaryButton>
                </>
            }
            {...rest}
        >
            <Alert type="error">
                {c('Info')
                    .t`Would you like to receive a new verification code or use an alternative verification method?`}
            </Alert>
        </ConfirmModal>
    );
};

InvalidVerificationCodeModal.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    edit: PropTypes.string,
    request: PropTypes.string
};

export default InvalidVerificationCodeModal;
