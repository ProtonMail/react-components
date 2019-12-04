import React from 'react';
import PropTypes from 'prop-types';
import { LinkButton, useToggle, Price, Icon } from 'react-components';
import { c } from 'ttag';
import { CURRENCIES } from 'proton-shared/lib/constants';

const SubscriptionPlan = ({
    canCustomize = false,
    expanded = false,
    features = [],
    addons = [],
    totalPerMonth = 0,
    currency
}) => {
    const { state, toggle } = useToggle(expanded);

    return (
        <>
            <div className="bordered-container flex flex-nowrap onmobile-flex-column mb1">
                <div className="p1" style={{ width: '230px' }}>
                    <div className="bold mb1">{c('Title').t`Plan summary`}</div>
                    <ul className="unstyled mb1">
                        {features.map((feature, index) => {
                            return <div key={index}>{feature}</div>;
                        })}
                    </ul>
                </div>
                {canCustomize && state ? (
                    <div className="border-left p1">
                        <div className="flex flex-nowrap flex-items-center flex-spacebetween">
                            <div className="bold">{c('Title').t`Configure plan`}</div>
                            <Price currency={currency} suffix={c('Suffix').t`/month`}>
                                {totalPerMonth}
                            </Price>
                        </div>
                        {addons.map((addon) => addon)}
                    </div>
                ) : null}
            </div>
            {canCustomize ? (
                <div className="mb1">
                    <LinkButton className="flex flex-nowrap flex-items-center" onClick={toggle}>
                        <Icon name="caret" className="mr1" />
                        <span>
                            {state
                                ? c('Action').t`Hide customization options`
                                : c('Action').t`Show customization options`}
                        </span>
                    </LinkButton>
                </div>
            ) : null}
        </>
    );
};

SubscriptionPlan.propTypes = {
    canCustomize: PropTypes.bool,
    expanded: PropTypes.bool,
    features: PropTypes.arrayOf(PropTypes.node),
    addons: PropTypes.arrayOf(PropTypes.node),
    totalPerMonth: PropTypes.number,
    currency: PropTypes.oneOf(CURRENCIES)
};

export default SubscriptionPlan;
