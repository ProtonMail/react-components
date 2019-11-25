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
            <Price currency={currency} suffix={c('Suffix').t`/mo`}>
                {plan.Pricing[cycle] / cycle}
            </Price>
            {cycle === CYCLE.YEARLY && <small>{c('Details').jt`Billed as ${billiedAmount} per year`}</small>}
            {cycle === CYCLE.TWO_YEARS && <small>{c('Details').jt`Billed as ${billiedAmount} every 2 year`}</small>}
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
