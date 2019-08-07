import React from 'react';
import PropTypes from 'prop-types';
import { Bordered } from 'react-components';
import { c } from 'ttag';

const PaymentMethodDetails = ({ type, details = {} }) => {
    const { Last4, Name, ExpMonth, ExpYear, BillingAgreementID } = details;
    if (type === 'card') {
        return (
            <Bordered className="bg-global-light">
                <h4>
                    <code>•••• •••• •••• {Last4}</code>
                </h4>
                <div className="flex-autogrid">
                    <div className="flex-autogrid-item">
                        <div>{c('Label').t`Cardholder name`}:</div>
                        <strong>{Name}</strong>
                    </div>
                    <div className="flex-autogrid-item">
                        <div>{c('Label for credit card').t`Expiration`}:</div>
                        <strong>
                            {ExpMonth}/{ExpYear}
                        </strong>
                    </div>
                </div>
            </Bordered>
        );
    }

    if (type === 'paypal') {
        return (
            <Bordered className="bg-global-light">
                <h4>
                    <code>PayPal {BillingAgreementID}</code>
                </h4>
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
