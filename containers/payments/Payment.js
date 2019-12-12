import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { classnames, Radio, Icon, Row, Alert, Price, LinkButton, Loader } from 'react-components';
import { PAYMENT_METHOD_TYPES, MIN_DONATION_AMOUNT, MIN_CREDIT_AMOUNT } from 'proton-shared/lib/constants';

import Method from './Method';
import toDetails from './toDetails';
import usePaymentMethods from '../paymentMethods/usePaymentMethods';

const { CARD, PAYPAL, CASH, BITCOIN } = PAYMENT_METHOD_TYPES;

const Payment = ({
    children,
    type,
    amount,
    currency,
    coupon,
    onParameters,
    method,
    onMethod,
    onValidCard,
    onPay,
    card
}) => {
    const { methods, options, loading } = usePaymentMethods({ amount, coupon, type });
    const lastCustomMethod = [...options]
        .reverse()
        .find(
            ({ value }) =>
                ![
                    PAYMENT_METHOD_TYPES.CARD,
                    PAYMENT_METHOD_TYPES.PAYPAL,
                    PAYMENT_METHOD_TYPES.CASH,
                    PAYMENT_METHOD_TYPES.BITCOIN
                ].includes(value)
        );

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

    useEffect(() => {
        const { value } = options.find(({ disabled }) => !disabled);
        handleChangeMethod(value);
    }, [methods.length]);

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

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Row>
                <div className="pm-label">
                    <label className="mb0-5 bl">{c('Label').t`Select a method`}</label>
                    {options.map(({ text, value, disabled, icon }, index) => {
                        return (
                            <label
                                htmlFor={value}
                                key={value}
                                className={classnames([
                                    'pt0-5 pb0-5 flex flex-nowrap flex-items-center',
                                    index === options.length - 1 && 'border-bottom',
                                    lastCustomMethod && lastCustomMethod.value === value && 'border-bottom'
                                ])}
                            >
                                <Radio
                                    disabled={loading || disabled}
                                    className="mr0-5"
                                    id={value}
                                    checked={value === method}
                                    onChange={() => handleChangeMethod(value)}
                                />
                                <Icon className="mr0-5" name={icon} />
                                <span>{text}</span>
                            </label>
                        );
                    })}
                    <div>
                        <LinkButton>
                            <Icon name="gift" className="mr0-5" />
                            <span>{c('Link').t`Use gift code`}</span>
                        </LinkButton>
                    </div>
                </div>
                <div>
                    <Method
                        loading={loading}
                        amount={amount}
                        currency={currency}
                        onCard={handleCard}
                        onPayPal={onPay}
                        card={card}
                        type={type}
                        method={method}
                        methods={methods}
                    />
                    {children}
                </div>
            </Row>
        </>
    );
};

Payment.propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(['signup', 'subscription', 'invoice', 'donation', 'credit']),
    amount: PropTypes.number.isRequired,
    coupon: PropTypes.string,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']),
    parameters: PropTypes.object,
    card: PropTypes.object,
    onParameters: PropTypes.func,
    method: PropTypes.string,
    onMethod: PropTypes.func,
    onValidCard: PropTypes.func,
    onPay: PropTypes.func
};

export default Payment;
