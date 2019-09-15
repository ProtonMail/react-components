import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Alert, Loader, SmallButton, Price, useApi, useLoading } from 'react-components';
import { MIN_PAYPAL_AMOUNT, MAX_PAYPAL_AMOUNT, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { createToken } from 'proton-shared/lib/api/payments';

import PaymentVerificationButton from './PaymentVerificationButton';

const { TOKEN } = PAYMENT_METHOD_TYPES;

const PayPal = ({ amount: Amount, currency: Currency, onPay, type }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [error, setError] = useState();
    const [approvalURL, setApprovalURL] = useState();
    const [token, setToken] = useState();

    const handleSubmit = () => {
        onPay({
            Amount,
            Currency,
            Payment: {
                Type: TOKEN,
                Details: {
                    Token: token
                }
            }
        });
    };

    const handleError = (error) => setError(error);

    const generateToken = async () => {
        const { Token, ApprovalURL } = await api(
            createToken({
                Amount,
                Currency,
                Payment: {
                    Type: 'paypal'
                }
            })
        );
        setApprovalURL(ApprovalURL);
        setToken(Token);
    };

    useEffect(() => {
        withLoading(generateToken());
    }, [Amount, Currency]);

    if (type === 'payment' && Amount < MIN_PAYPAL_AMOUNT) {
        return (
            <Alert type="error">
                {c('Error').t`Amount below minimum.`} {`(${<Price currency={Currency}>{MIN_PAYPAL_AMOUNT}</Price>})`}
            </Alert>
        );
    }

    if (Amount > MAX_PAYPAL_AMOUNT) {
        return <Alert type="error">{c('Error').t`Amount above the maximum.`}</Alert>;
    }

    if (error) {
        return (
            <Alert type="error">
                <div className="mb0-5">{error.message}</div>
                <div>
                    <SmallButton
                        loading={loading}
                        onClick={() => {
                            setError();
                            withLoading(generateToken());
                        }}
                    >{c('Action').t`Try again`}</SmallButton>
                </div>
            </Alert>
        );
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Alert>{c('Info')
                .t`You will need to login to your PayPal account to complete this transaction. We will open a new tab with PayPal for you. If you use any pop-up blockers, please disable them to continue.`}</Alert>
            <PaymentVerificationButton
                approvalURL={approvalURL}
                token={token}
                onSubmit={handleSubmit}
                onError={handleError}
            >{c('Action').t`Check out with PayPal`}</PaymentVerificationButton>
        </>
    );
};

PayPal.propTypes = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    onPay: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['signup', 'subscription', 'invoice', 'donation', 'credit', 'update'])
};

export default PayPal;
