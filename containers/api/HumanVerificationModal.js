import React from 'react';
import PropTypes from 'prop-types';
import { FormModal, useNotifications } from 'react-components';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import { c } from 'ttag';

import './HumanVerificationModal.scss';
import HumanVerificationForm from './HumanVerificationForm';

const HumanVerificationModal = ({ token, methods = [], onSuccess, onVerify, ...rest }) => {
    const title = c('Title').t`Human verification`;
    const { createNotification } = useNotifications();

    const handleSubmit = async (token, tokenType) => {
        try {
            await onVerify({ token, tokenType });
            createNotification({ text: c('Success').t`Verification successful` });
            rest.onClose();
            onSuccess();
        } catch (error) {
            const { data: { Code } = { Code: 0 } } = error;

            if (Code === API_CUSTOM_ERROR_CODES.TOKEN_INVALID) {
                createNotification({ text: c('Error').t`Invalid verification code`, type: 'error' });
            }

            throw error;
        }
    };

    return (
        <FormModal
            className="human-verification-modal pm-modal--heightAuto"
            hasClose={false}
            title={title}
            footer={null}
            {...rest}
        >
            <HumanVerificationForm
                onSubmit={handleSubmit}
                methods={methods}
                token={token} />
        </FormModal>
    );
};

HumanVerificationModal.propTypes = {
    token: PropTypes.string,
    methods: PropTypes.arrayOf(PropTypes.string),
    onSuccess: PropTypes.func
};

export default HumanVerificationModal;
