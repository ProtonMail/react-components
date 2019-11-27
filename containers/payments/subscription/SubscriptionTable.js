import React from 'react';
import PropTypes from 'prop-types';
import { useToggle, Button, classnames, LinkButton } from 'react-components';
import { c } from 'ttag';

const SubscriptionTable = ({ plans, onSelect, currentPlanIndex = 0, mostPopularIndex = 0 }) => {
    const { state: showAllFeatures, toggle: toggleFeatures } = useToggle(false);

    return (
        <div className="bordered-container mt2">
            <div className="flex flex-nowrap onmobile-flex-column border-bottom">
                {plans.map(({ planName, price, imageSrc, description, features = [], canCustomize }, index) => {
                    return (
                        <div
                            key={planName}
                            className={classnames([
                                'subscriptionTable-plan w25 onmobile-w100 pt2 pb2 pl1 pr1 flex flex-column relative',
                                index && 'border-left'
                            ])}
                            data-current-plan={index === currentPlanIndex}
                            data-most-popular={index === mostPopularIndex}
                        >
                            <header className="flex flex-column flex-justify-end subscriptionTable-header">
                                {index === currentPlanIndex ? (
                                    <div className="subscriptionTable-currentPlan-container aligncenter uppercase bold smaller mb0 mt0">{c(
                                        'Title for subscription plan'
                                    ).t`Current plan`}</div>
                                ) : null}
                                {index === mostPopularIndex ? (
                                    <div className="mb0-5 aligncenter color-global-success bold small mt0 uppercase">{c(
                                        'Title for subscription plan'
                                    ).t`Most popular`}</div>
                                ) : null}
                                <div className="bold aligncenter mb0-5 uppercase">{planName}</div>
                                <div className="aligncenter mb0-5">{price}</div>
                                <div className="flex flex-items-center flex-justify-center subscriptionTable-image-container">
                                    <img src={imageSrc} alt={planName} />
                                </div>
                            </header>
                            <p className="aligncenter mt0 mb1">{description}</p>
                            <ul className="unstyled small mb2 flex-item-fluid-auto">
                                {features.map((feature, index) => {
                                    return (
                                        <li className="subscriptionTable-feature" key={index}>
                                            {feature}
                                        </li>
                                    );
                                })}
                            </ul>
                            <footer className="aligncenter">
                                {index === currentPlanIndex && !canCustomize ? (
                                    c('Label').t`Current plan`
                                ) : (
                                    <Button
                                        className={classnames([index !== currentPlanIndex && 'pm-button--primary'])}
                                        onClick={() => onSelect(index)}
                                    >
                                        {index === currentPlanIndex ? c('Action').t`Update` : c('Action').t`Select`}
                                    </Button>
                                )}
                                {canCustomize ? (
                                    <LinkButton onClick={() => onSelect(index)}>{c('Action').t`Customize`}</LinkButton>
                                ) : null}
                            </footer>
                        </div>
                    );
                })}
            </div>
            <div className="aligncenter pt0-5 pb0-5 nomobile">
                <LinkButton onClick={toggleFeatures}>
                    {showAllFeatures ? c('Action').t`Close feature comparison` : c('Action').t`Compare all features`}
                </LinkButton>
            </div>
            {showAllFeatures ? (
                <div className="flex flex-nowrap nomobile border-top">
                    {plans.map(({ planName, allFeatures = [], canCustomize }, index) => {
                        return (
                            <div
                                key={planName}
                                className={classnames([
                                    'w25 pt2 pb2 flex flex-column relative',
                                    index && 'border-left'
                                ])}
                            >
                                <ul className="unstyled mb2 flex-item-fluid-auto">
                                    {allFeatures.map((feature, index) => {
                                        return (
                                            <li
                                                className={classnames(['pl1 pr1', index & 1 && 'bg-global-light'])}
                                                key={index}
                                            >
                                                {feature}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <footer className="aligncenter">
                                    {index === currentPlanIndex && !canCustomize ? (
                                        c('Label').t`Current plan`
                                    ) : (
                                        <Button
                                            className={classnames([index !== currentPlanIndex && 'pm-button--primary'])}
                                            onClick={() => onSelect(index)}
                                        >
                                            {index === currentPlanIndex ? c('Action').t`Update` : c('Action').t`Select`}
                                        </Button>
                                    )}
                                    {canCustomize ? (
                                        <LinkButton onClick={() => onSelect(index)}>{c('Action')
                                            .t`Customize`}</LinkButton>
                                    ) : null}
                                </footer>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

SubscriptionTable.propTypes = {
    plans: PropTypes.arrayOf(
        PropTypes.shape({
            planName: PropTypes.string.isRequired,
            price: PropTypes.node.isRequired,
            imageSrc: PropTypes.string.isRequired,
            description: PropTypes.node.isRequired,
            features: PropTypes.arrayOf(PropTypes.node).isRequired
        })
    ),
    onSelect: PropTypes.func.isRequired,
    currentPlanIndex: PropTypes.number,
    mostPopularIndex: PropTypes.number
};

export default SubscriptionTable;
