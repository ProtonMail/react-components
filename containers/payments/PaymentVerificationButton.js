import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton, useApi } from 'react-components';

import { process } from './paymentTokenHelper';

const PaymentVerificationButton = ({ children, approvalURL, token, onError, onSubmit }) => {
    const api = useApi();

    const handleClick = async () => {
        const tab = window.open(approvalURL);

        try {
            await process({ Token: token, api, tab });
            onSubmit();
        } catch (error) {
            onError(error);
        }
    };

    return <PrimaryButton onClick={handleClick}>{children}</PrimaryButton>;
};

PaymentVerificationButton.propTypes = {
    children: PropTypes.node.isRequired,
    approvalURL: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    onError: PropTypes.func,
    onSubmit: PropTypes.func
};

export default PaymentVerificationButton;
