import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Alert, Price, Button, Loader, useConfig, useApi, useLoading } from 'react-components';
import { createBitcoinPayment } from 'proton-shared/lib/api/payments';
import { MIN_BITCOIN_AMOUNT, BTC_DONATION_ADDRESS, CLIENT_TYPES, CURRENCIES } from 'proton-shared/lib/constants';

import BitcoinQRCode from './BitcoinQRCode';
import BitcoinDetails from './BitcoinDetails';

const { VPN } = CLIENT_TYPES;

const Bitcoin = ({ amount, currency, type }) => {
    const api = useApi();
    const { CLIENT_TYPE } = useConfig();
    const [loading, withLoading] = useLoading();
    const [error, setError] = useState(false);
    const [model, setModel] = useState({});

    const request = async () => {
        setError(false);
        try {
            const { AmountBitcoin, Address } = await api(createBitcoinPayment(amount, currency));
            setModel({ amountBitcoin: AmountBitcoin, address: type === 'donation' ? BTC_DONATION_ADDRESS : Address });
        } catch (error) {
            setError(true);
            throw error;
        }
    };

    useEffect(() => {
        if (amount > MIN_BITCOIN_AMOUNT) {
            withLoading(request());
        }
    }, [amount]);

    if (amount < MIN_BITCOIN_AMOUNT) {
        const i18n = (amount) => c('Info').jt`Amount below minimum. (${amount})`;
        return <Alert type="warning">{i18n(<Price currency={currency}>{amount}</Price>)}</Alert>;
    }

    if (loading) {
        return <Loader />;
    }

    if (error || !model.amountBitcoin || !model.address) {
        return (
            <>
                <Alert type="error">{c('Error').t`Error connecting to the Bitcoin API.`}</Alert>
                <Button onClick={() => withLoading(request())}>{c('Action').t`Try again`}</Button>
            </>
        );
    }

    return (
        <>
            <figure role="group" className="bordered-container bg-global-light mb1">
                <div className="p1 border-bottom">
                    <BitcoinQRCode
                        className="mb1 w50 center"
                        amount={model.amountBitcoin}
                        address={model.address}
                        type={type}
                    />
                </div>
                <BitcoinDetails amount={model.amountBitcoin} address={model.address} />
            </figure>
            {type === 'invoice' ? (
                <Alert>{c('Info')
                    .t`Bitcoin transactions can take some time to be confirmed (up to 24 hours). Once confirmed, we will add credits to your account. After transaction confirmation, you can pay your invoice with the credits.`}</Alert>
            ) : (
                <Alert
                    learnMore={
                        CLIENT_TYPE === VPN
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
    currency: PropTypes.oneOf(CURRENCIES),
    type: PropTypes.string
};

export default Bitcoin;
