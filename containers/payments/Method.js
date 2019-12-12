import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { Alert, Loader } from 'react-components';
import { c } from 'ttag';
import treeDSecureSvg from 'design-system/assets/img/shared/bank-icons/3-d-secure.svg';
import americanExpressSafekeySvg from 'design-system/assets/img/shared/bank-icons/american-express-safekey.svg';
import discoverProtectBuySvg from 'design-system/assets/img/shared/bank-icons/discover-protectbuy.svg';
import mastercardSecurecodeSvg from 'design-system/assets/img/shared/bank-icons/mastercard-securecode.svg';
import verifiedByVisaSvg from 'design-system/assets/img/shared/bank-icons/verified-by-visa.svg';

import Card from './Card';
import PaymentMethodDetails from '../paymentMethods/PaymentMethodDetails';
import PayPal from './PayPal';
import Cash from './Cash';
import Bitcoin from './Bitcoin';

const { CARD, PAYPAL, BITCOIN, CASH } = PAYMENT_METHOD_TYPES;

const Alert3DS = () => {
    return (
        <Alert>
            <div className="mb0-5">{c('Info').t`We use 3-D Secure to protect your payments.`}</div>
            <div className="flex flex-nowrap flex-items-center">
                <img width="60" className="mr1" src={treeDSecureSvg} />
                <img width="60" className="mr1" src={americanExpressSafekeySvg} />
                <img width="60" className="mr1" src={discoverProtectBuySvg} />
                <img width="60" className="mr1" src={mastercardSecurecodeSvg} />
                <img width="60" className="mr1" src={verifiedByVisaSvg} />
            </div>
        </Alert>
    );
};

const Method = ({ type, amount = 0, currency, onCard, onPayPal, method, methods, loading, card: cardToUse }) => {
    const { card, updateCard, errors, isValid } = cardToUse;

    useEffect(() => {
        onCard({ card, isValid });
    }, [card]);

    if (loading) {
        return <Loader />;
    }

    if (method === CARD) {
        return (
            <>
                <Card card={card} errors={errors} onChange={updateCard} />
                <Alert3DS />
            </>
        );
    }

    if (method === CASH) {
        return <Cash />;
    }

    if (method === BITCOIN) {
        return <Bitcoin amount={amount} currency={currency} type={type} />;
    }

    if (method === PAYPAL) {
        return <PayPal amount={amount} currency={currency} onPay={onPayPal} type={type} />;
    }

    const { Details, Type } = methods.find(({ ID }) => method === ID) || {};

    if (Details) {
        return (
            <>
                <PaymentMethodDetails type={Type} details={Details} />
                <Alert3DS />
            </>
        );
    }

    return null;
};

Method.propTypes = {
    loading: PropTypes.bool,
    method: PropTypes.string.isRequired,
    methods: PropTypes.array,
    type: PropTypes.oneOf(['signup', 'subscription', 'invoice', 'donation', 'credit']),
    amount: PropTypes.number,
    card: PropTypes.object.isRequired,
    onCard: PropTypes.func,
    onPayPal: PropTypes.func,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD'])
};

export default Method;
