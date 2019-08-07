import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Label, Row, Field } from 'react-components';
import { CYCLE } from 'proton-shared/lib/constants';

import Method from './Method';
import PaymentMethodsSelect from '../paymentMethods/PaymentMethodsSelect';
import toDetails from './toDetails';

const Payment = ({ type, amount, currency, cycle, onParameters, method, onMethod, onValidCard }) => {
    const handleToken = (Details) => onParameters({ Payment: { Type: 'token', Details } });

    const handleCard = ({ card, isValid }) => {
        onValidCard(isValid);
        isValid && onParameters({ Payment: { Type: 'card', Details: toDetails(card) } });
    };

    const handleChangeMethod = (newMethod) => {
        onMethod(newMethod);

        if (!['card', 'paypal', 'cash', 'bitcoin'].includes(newMethod)) {
            onParameters({ PaymentMethodID: newMethod });
        }
    };

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
                        onPayPal={handleToken}
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
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS])
};

export default Payment;
