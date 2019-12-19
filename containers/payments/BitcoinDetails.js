import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Copy } from 'react-components';

const BitcoinDetails = ({ amount, address }) => {
    return (
        <figcaption>
            <div className="p1 flex flex-nowrap border-bottom">
                <label className="mr0-5">{c('Label').t`Amount BTC`}</label>
                <strong>{amount}</strong>
            </div>
            <div className="p1 flex flex-nowrap flex-items-center">
                <label className="mr0-5">{c('Label').t`BTC address`}</label>
                <div className="flex">
                    <strong className="mt0-5 mr1 ellipsis" title={address}>
                        {address}
                    </strong>
                    <Copy value={address} />
                </div>
            </div>
        </figcaption>
    );
};

BitcoinDetails.propTypes = {
    amount: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired
};

export default BitcoinDetails;
