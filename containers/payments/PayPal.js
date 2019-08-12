import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Alert, PrimaryButton, SmallButton, Price, useApi, useLoading } from 'react-components';
import { createToken, getTokenStatus } from 'proton-shared/lib/api/payments';
import {
    MIN_PAYPAL_AMOUNT,
    MAX_PAYPAL_AMOUNT,
    PAYMENT_TOKEN_STATUS,
    PAYMENT_METHOD_TYPES
} from 'proton-shared/lib/constants';
import { wait } from 'proton-shared/lib/helpers/promise';

const {
    STATUS_PENDING,
    STATUS_CHARGEABLE,
    STATUS_FAILED,
    STATUS_CONSUMED,
    STATUS_NOT_SUPPORTED
} = PAYMENT_TOKEN_STATUS;

const DELAY_PULLING = 5000;
const DELAY_PAYPAL_TAB_LISTENER = 1000;

const PayPal = ({ amount, currency, onPay, type }) => {
    const [loading, withLoading] = useLoading();
    const tabRef = useRef(null);
    const timerRef = useRef(0);
    const processRef = useRef(true);
    const tokenRef = useRef('');
    const api = useApi();
    const [approvalURL, setAppovalURL] = useState('');
    const [error, setError] = useState(null);

    const I18N = {
        processCancelled: c('Error').t`Payment process cancelled`,
        timeout: c('Error').t`Payment process cancelled, please try again`,
        unknownStatus: c('Error').t`Unknown status, please try again`,
        failed: c('Error').t`Payment process failed, please try again`,
        consumed: c('Error').t`Payment process consumed, please try again`,
        notSupported: c('Error').t`Payment process not supported`
    };

    const reset = () => {
        tabRef.current && tabRef.current.close();
        tabRef.current = null;
        processRef.current = true;
        timerRef.current = 0;
        tokenRef.current = '';
        setError(null);
        window.removeEventListener('message', onMessage, false);
    };

    const load = async () => {
        reset();
        const { ApprovalURL, Token, Status } = await api(
            createToken({
                Amount: amount,
                Currency: currency,
                Payment: {
                    Type: PAYMENT_METHOD_TYPES.PAYPAL
                }
            })
        );

        if (Status === STATUS_CHARGEABLE) {
            onPay({ Token });
            return reset();
        }

        tokenRef.current = Token;
        setAppovalURL(ApprovalURL);
    };

    const pull = async () => {
        if (!processRef.current) {
            const error = new Error(I18N.processCancelled);
            error.tryAgain = true;
            throw error;
        }

        if (timerRef.current > DELAY_PULLING * 30) {
            const error = new Error(I18N.timeout);
            error.tryAgain = true;
            throw error;
        }

        const { Status } = await api(getTokenStatus(tokenRef.current));

        if (Status === STATUS_FAILED) {
            const error = new Error(I18N.failed);
            error.tryAgain = true;
            throw error;
        }

        if (Status === STATUS_CONSUMED) {
            const error = new Error(I18N.consumed);
            error.tryAgain = true;
            throw error;
        }

        if (Status === STATUS_NOT_SUPPORTED) {
            throw new Error(I18N.notSupported);
        }

        if (Status === STATUS_CHARGEABLE) {
            return;
        }

        if (Status === STATUS_PENDING) {
            await wait(DELAY_PULLING);
            timerRef.current += DELAY_PULLING;
            return pull();
        }

        const error = new Error(I18N.unknownStatus);
        error.tryAgain = true;
        throw error;
    };

    const listenPayPalTab = async () => {
        await wait(DELAY_PAYPAL_TAB_LISTENER);
        if (tabRef.current.closed) {
            return;
        }
        return listenPayPalTab();
    };

    const handleClick = () => {
        window.addEventListener('message', onMessage, false);
        tabRef.current = window.open(approvalURL, 'PayPal');
        withLoading(listenPayPalTab());
    };

    const startPulling = async () => {
        try {
            await pull();
            onPay({ Token: tokenRef.current });
            reset();
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    const onMessage = (event) => {
        const origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

        if (origin !== 'https://secure.protonmail.com') {
            return;
        }

        if (event.source !== tabRef.current) {
            return;
        }

        const { cancel } = event.data;

        if (cancel) {
            processRef.current = false;
            reset();
            return;
        }

        withLoading(startPulling());
    };

    useEffect(() => {
        withLoading(load());
        return () => {
            reset();
        };
    }, []);

    if (type === 'payment' && amount < MIN_PAYPAL_AMOUNT) {
        return (
            <Alert type="error">
                {c('Error').t`Amount below minimum.`} {`(${<Price currency={currency}>{MIN_PAYPAL_AMOUNT}</Price>})`}
            </Alert>
        );
    }

    if (amount > MAX_PAYPAL_AMOUNT) {
        return <Alert type="error">{c('Error').t`Amount above the maximum.`}</Alert>;
    }

    if (error) {
        return (
            <Alert type="error">
                {error.message}
                {error.tryAgain ? (
                    <div>
                        <SmallButton onClick={() => withLoading(load())}>{c('Action').t`Try again`}</SmallButton>
                    </div>
                ) : null}
            </Alert>
        );
    }

    return (
        <>
            <Alert>{c('Info')
                .t`You will need to login to your PayPal account to complete this transaction. We will open a new tab with PayPal for you. If you use any pop-up blockers, please disable them to continue.`}</Alert>
            <PrimaryButton onClick={handleClick} loading={loading}>{c('Action')
                .t`Check out with PayPal`}</PrimaryButton>
        </>
    );
};

PayPal.propTypes = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    onPay: PropTypes.func.isRequired,
    type: PropTypes.string
};

export default PayPal;
