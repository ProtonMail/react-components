import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Alert, Price, Button, useApiResult, useConfig } from 'react-components';
import { createBitcoinPayment } from 'proton-shared/lib/api/payments';
import { MIN_BITCOIN_AMOUNT, BTC_DONATION_ADDRESS, APPS } from 'proton-shared/lib/constants';

import BitcoinQRCode from './BitcoinQRCode';
import BitcoinDetails from './BitcoinDetails';

const { PROTONVPN_SETTINGS } = APPS;

const Bitcoin = ({ amount, currency, type }) => {
    const { APP_NAME } = useConfig();
    const { result = {}, request, error = {} } = useApiResult(() => createBitcoinPayment(amount, currency), []);
    const { AmountBitcoin, Address } = result;
    const address = type === 'donation' ? BTC_DONATION_ADDRESS : Address;

    if (amount < MIN_BITCOIN_AMOUNT) {
        const i18n = (amount) => c('Info').jt`Amount below minimum. (${amount})`;
        return <Alert type="warning">{i18n(<Price currency={currency}>{amount}</Price>)}</Alert>;
    }

    if (!AmountBitcoin || !Address) {
        return null;
    }

    if (error.Error) {
        return (
            <>
                <Alert type="error">{c('Error').t`Error connecting to the Bitcoin API.`}</Alert>
                <Button onClick={request}>{c('Action').t`Try again`}</Button>
            </>
        );
    }

    return (
        <>
            <figure role="group">
                <BitcoinQRCode className="mb1 w50 center" amount={AmountBitcoin} address={address} type={type} />
                <BitcoinDetails amount={AmountBitcoin} address={address} />
            </figure>
            {type === 'invoice' ? (
                <Alert>{c('Info')
                    .t`Bitcoin transactions can take some time to be confirmed (up to 24 hours). Once confirmed, we will add credits to your account. After transaction confirmation, you can pay your invoice with the credits.`}</Alert>
            ) : (
                <Alert
                    learnMore={
                        APP_NAME === PROTONVPN_SETTINGS
                            ? 'https://protonvpn.com/support/vpn-bitcoin-payments/'
                            : 'https://protonmail.com/support/knowledge-base/paying-with-bitcoin'
                    }
                >{c('Info')
                    .t`After making your Bitcoin payment, please follow the instructions below to upgrade.`}</Alert>
            )}
        </>
    );
};

Bitcoin.propTypes = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']),
    type: PropTypes.string
};

export default Bitcoin;
