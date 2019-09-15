import React from 'react';
import PropTypes from 'prop-types';
import { FormModal, Alert, useLoading, useNotifications } from 'react-components';
import { c } from 'ttag';
import tabSvg from 'design-system/assets/img/pm-images/tab.svg';

import { toParams } from './paymentTokenHelper';
import PaymentVerificationButton from './PaymentVerificationButton';

const PaymentVerificationModal = ({ params, token, approvalURL, onSubmit, ...rest }) => {
    const { createNotification } = useNotifications();
    const [loading] = useLoading();
    const title = loading ? c('Title').t`Payment verification in progress` : c('Title').t`Payment verification`;

    const handleSubmit = async () => {
        onSubmit(toParams(params, token));
        rest.onClose();
    };

    const handleError = (error) => {
        rest.onClose();

        // if not coming from API error
        if (error.message && !error.config) {
            createNotification({ text: error.message, type: 'error' });
        }
    };

    return (
        <FormModal
            title={title}
            submit={
                <PaymentVerificationButton
                    approvalURL={approvalURL}
                    token={token}
                    onError={handleError}
                    onSubmit={handleSubmit}
                >{c('Action').t`Verify payment`}</PaymentVerificationButton>
            }
            small={true}
            {...rest}
        >
            <img src={tabSvg} alt={c('Title').t`New tab`} />
            <Alert>{c('Info').t`A new tab will open to confirm the payment, please disable any popup blockers.`}</Alert>
        </FormModal>
    );
};

PaymentVerificationModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    approvalURL: PropTypes.string.isRequired,
    params: PropTypes.object
};

export default PaymentVerificationModal;
