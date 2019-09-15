import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton, useApi, useLoading } from 'react-components';

import { process } from './paymentTokenHelper';

const PaymentVerificationButton = ({ children, approvalURL, token, onError, onSubmit, onLoading }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();

    const handleClick = async () => {
        const tab = window.open(approvalURL);

        try {
            await process({ Token: token, api, tab });
            onSubmit();
        } catch (error) {
            onError(error);
        }
    };

    useEffect(() => {
        onLoading(loading);
    }, [loading]);

    return <PrimaryButton onClick={() => withLoading(handleClick())}>{children}</PrimaryButton>;
};

PaymentVerificationButton.propTypes = {
    children: PropTypes.node.isRequired,
    approvalURL: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onLoading: PropTypes.func
};

export default PaymentVerificationButton;
