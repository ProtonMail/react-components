import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, PaymentSelector } from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_DONATION_AMOUNT } from 'proton-shared/lib/constants';
import { c } from 'ttag';

const Donate = () => {
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [amount, setAmount] = useState(DEFAULT_DONATION_AMOUNT);
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
        </>
    );
};

Donate.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default Donate;
