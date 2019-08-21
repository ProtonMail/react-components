import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Label, Row, Field, Alert, Price } from 'react-components';
import { CYCLE, PAYMENT_METHOD_TYPES, MIN_DONATION_AMOUNT, MIN_CREDIT_AMOUNT } from 'proton-shared/lib/constants';

import Method from './Method';
import PaymentMethodsSelect from '../paymentMethods/PaymentMethodsSelect';
import toDetails from './toDetails';

const { CARD, PAYPAL, CASH, BITCOIN } = PAYMENT_METHOD_TYPES;

const Payment = ({ type, amount, currency, cycle, onParameters, method, onMethod, onValidCard, onPay }) => {
    const handleCard = ({ card, isValid }) => {
        onValidCard(isValid);
        isValid && onParameters({ Payment: { Type: CARD, Details: toDetails(card) } });
    };

    const handleChangeMethod = (newMethod) => {
        onMethod(newMethod);

        if (![CARD, PAYPAL, CASH, BITCOIN].includes(newMethod)) {
            onParameters({ PaymentMethodID: newMethod });
        }
    };

    if (type === 'donation' && amount < MIN_DONATION_AMOUNT) {
        const price = (
            <Price key="price" currency={currency}>
                {MIN_DONATION_AMOUNT}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum amount that can be donated is ${price}`}</Alert>;
    }

    if (type === 'credit' && amount < MIN_CREDIT_AMOUNT) {
        const price = (
            <Price key="price" currency={currency}>
                {MIN_CREDIT_AMOUNT}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum amount of credit that can be added is ${price}`}</Alert>;
    }

    if (amount <= 0) {
        const price = (
            <Price key="price" currency={currency}>
                {0}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum payment we accept is ${price}`}</Alert>;
    }

    return (
        <>
            <Row>
                <Label>{c('Label').t`Payment method`}</Label>
                <Field>
                    <div className="mb1">
                        <PaymentMethodsSelect
                            cycle={cycle}
                            method={method}
                            amount={amount}
                            type={type}
                            onChange={handleChangeMethod}
                        />
                    </div>
                    <Method
                        amount={amount}
                        currency={currency}
                        onCard={handleCard}
                        onPayPal={onPay}
                        type={type}
                        method={method}
                    />
                </Field>
            </Row>
        </>
    );
};

Payment.propTypes = {
    type: PropTypes.oneOf(['signup', 'subscription', 'invoice', 'donation', 'credit']),
    amount: PropTypes.number.isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']),
    parameters: PropTypes.object,
    onParameters: PropTypes.func,
    method: PropTypes.string,
    onMethod: PropTypes.func,
    onValidCard: PropTypes.func,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]),
    onPay: PropTypes.func
};

export default Payment;
