import React from 'react';
import PropTypes from 'prop-types';
import { Bordered } from 'react-components';
import { c } from 'ttag';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

const banks = require.context('design-system/assets/img/shared/bank-icons', true, /.svg$/);

const banksMap = banks.keys().reduce((acc, key) => {
    acc[key] = () => banks(key);
    return acc;
}, {});

const getBankSvg = (type = '') => {
    const key = `./cc-${type}.svg`;
    if (!banksMap[key]) {
        return;
    }
    return banksMap[key]().default;
};

const BANKS = {
    'American Express': 'american-express',
    'Diners Club': 'diners-club',
    Discover: 'discover',
    JCB: 'jcb',
    Maestro: 'maestro',
    MasterCard: 'mastercard',
    UnionPay: 'unionpay',
    Visa: 'visa'
};

const PaymentMethodDetails = ({ type, details = {} }) => {
    const { Last4, Name, ExpMonth, ExpYear, Payer, Brand = '' } = details;

    if (type === PAYMENT_METHOD_TYPES.CARD) {
        const bankIcon = getBankSvg(BANKS[Brand]);
        return (
            <Bordered className="bg-global-highlight inline-flex flex-column w100 pl2 pr2 pb2">
                {bankIcon ? <img width="70" src={bankIcon} alt={Brand} className="mb1" /> : null}
                <span className="color-global-grey-dm bl mb1 opacity-40">{c('Label').t`Card number`}</span>
                <code className="bl size-40 strong mb0-5">•••• •••• •••• {Last4}</code>
                <div className="flex flex-nowrap flex-spacebetween">
                    <div>
                        <span className="color-global-grey-dm bl mb0-5 opacity-40">{c('Label').t`Card holder`}</span>
                        <span className="bigger mt0 mb0">{Name}</span>
                    </div>
                    <div className="alignright">
                        <span className="color-global-grey-dm bl mb0-5 opacity-40">{c('Label').t`Expires`}</span>
                        <span className="bigger mt0 mb0">
                            {ExpMonth}/{ExpYear}
                        </span>
                    </div>
                </div>
            </Bordered>
        );
    }

    if (type === PAYMENT_METHOD_TYPES.PAYPAL) {
        const bankIcon = getBankSvg('paypal');
        return (
            <Bordered className="bg-global-highlight p2">
                <div>
                    <img width="70" src={bankIcon} alt="PayPal" className="mb1" />
                </div>
                <div className="flex flex-nowrap flex-items-center">
                    <label className="color-global-grey-dm mr1" htmlFor="paypal-payer">{c('Label').t`Payer`}</label>
                    <code id="paypal-payer" className="bl bigger mb0 mb1">
                        {Payer}
                    </code>
                </div>
            </Bordered>
        );
    }

    return null;
};

PaymentMethodDetails.propTypes = {
    type: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired
};

export default PaymentMethodDetails;
