import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, PaymentSelector, Payment, PrimaryButton, usePayment, useLoading, useApi } from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_DONATION_AMOUNT } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import { verifyPayment } from 'proton-shared/lib/api/payments';

const Donate = ({ onSubmit }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [amount, setAmount] = useState(DEFAULT_DONATION_AMOUNT);

    const handleSubmit = async (parameters) => {
        const data = await api(
            verifyPayment({
                ...parameters,
                Currency: currency,
                Amount: amount
            })
        );
        // console.log(data);
        onSubmit(data);
    };

    const { card, setCard, errors, method, setMethod, parameters, canPay, paypal, paypalCredit } = usePayment({
        amount,
        currency,
        onPay: handleSubmit
    });
    return (
        <>
            <Alert>{c('Info').t`Your payment details are protected with TLS encryption and Swiss privacy laws.`}</Alert>
            <label className="mb0-5 bl">{c('Label').t`Select an amount`}</label>
            <PaymentSelector
                amount={amount}
                onChangeAmount={setAmount}
                currency={currency}
                onChangeCurrency={setCurrency}
            />
            <Payment
                type="donation"
                method={method}
                amount={amount}
                currency={currency}
                card={card}
                onMethod={setMethod}
                onCard={setCard}
                errors={errors}
                paypal={paypal}
                paypalCredit={paypalCredit}
            />
            {canPay ? (
                <PrimaryButton onClick={() => withLoading(handleSubmit(parameters))} loading={loading}>{c('Action')
                    .t`Pay`}</PrimaryButton>
            ) : null}
        </>
    );
};

Donate.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default Donate;
