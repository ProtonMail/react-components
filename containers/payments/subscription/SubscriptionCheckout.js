import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { CurrencySelector, CycleSelector } from 'react-components';

const SubscriptionCheckout = ({ model, setModel }) => {
    return (
        <>
            <div className="flex flex-nowrap mb1">
                <CurrencySelector currency={model.currency} onSelect={(newCurrency) => setModel({ ...model, currency: newCurrency })} />
                <CycleSelector cycle={model.cycle} onSelect={(newCycle) => setModel({ ...model, cycle: newCycle })} />
            </div>
            <div className="mb1">
                <header></header>
            </div>
        </>
    );
};

SubscriptionCheckout.propTypes = {
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired
};

export default SubscriptionCheckout;