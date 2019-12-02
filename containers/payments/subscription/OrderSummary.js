import React from 'react';
import PropTypes from 'prop-types';

import AlertPromotion from './AlertPromotion';
import SubscriptionDetails from './SubscriptionDetails';
import PaymentDetails from './PaymentDetails';

const OrderSummary = ({ plans, model, onChange, check }) => {
    return (
        <>
            <AlertPromotion model={model} onChange={onChange} />
            <SubscriptionDetails model={model} plans={plans} check={check} onChange={onChange} />
            <PaymentDetails model={model} check={check} onChange={onChange} />
        </>
    );
};

OrderSummary.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    check: PropTypes.object
};

export default OrderSummary;
