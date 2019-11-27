import React from 'react';
import PropTypes from 'prop-types';
import { Price } from 'react-components';
import { CYCLE } from 'proton-shared/lib/constants';
import { c } from 'ttag';

const SubscriptionPrices = ({ cycle, currency, plan }) => {
    const billiedAmount = (
        <Price key="billed-amount" currency={currency}>
            {plan.Pricing[cycle]}
        </Price>
    );
    return (
        <>
            <Price currency={currency} className="subscriptionPrices-monthly" suffix={c('Suffix').t`/mo`}>
                {plan.Pricing[cycle] / cycle}
            </Price>
            {cycle === CYCLE.YEARLY && (
                <div className="small mt0 mb0">{c('Details').jt`Billed as ${billiedAmount} per year`}</div>
            )}
            {cycle === CYCLE.TWO_YEARS && (
                <div className="small mt0 mb0">{c('Details').jt`Billed as ${billiedAmount} every 2 year`}</div>
            )}
        </>
    );
};

SubscriptionPrices.propTypes = {
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]).isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']).isRequired,
    plan: PropTypes.shape({
        Pricing: PropTypes.object
    }).isRequired
};

export default SubscriptionPrices;
