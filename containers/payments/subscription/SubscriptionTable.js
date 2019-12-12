import React from 'react';
import PropTypes from 'prop-types';
import { Button, classnames, LinkButton } from 'react-components';
import { c } from 'ttag';

const SubscriptionTable = ({
    plans,
    onSelect,
    currentPlanIndex = 0,
    mostPopularIndex = 0,
    currentPlan = c('Title for subscription plan').t`Current plan`,
    selected = c('Info').t`Current plan`,
    update = c('Action').t`Update`,
    select = c('Action').t`Select`
}) => {
    return (
        <div className="mt2 subscriptionTable">
            <div className="flex-autogrid onmobile-flex-column">
                {plans.map(({ name, title, price, imageSrc, description, features = [], canCustomize }, index) => {
                    return (
                        <div key={title} className="flex-autogrid-item flex" data-plan-name={name}>
                            <div
                                className="bordered-container subscriptionTable-plan pt2 pb2 pl0-5 pr0-5 flex flex-column relative w100"
                                data-current-plan={index === currentPlanIndex}
                                data-most-popular={index === mostPopularIndex}
                            >
                                <header className="flex flex-column flex-justify-end subscriptionTable-header">
                                    {index === currentPlanIndex ? (
                                        <div className="subscriptionTable-currentPlan-container aligncenter uppercase bold smaller mb0 mt0">
                                            {currentPlan}
                                        </div>
                                    ) : null}
                                    {index === mostPopularIndex ? (
                                        <div className="mb0-5 aligncenter color-global-success bold small mt0 uppercase">{c(
                                            'Title for subscription plan'
                                        ).t`Most popular`}</div>
                                    ) : null}
                                    <div className="bold aligncenter mb0-5 uppercase">{title}</div>
                                    <div className="aligncenter mb0-5">{price}</div>
                                    <div className="flex flex-items-center flex-justify-center subscriptionTable-image-container">
                                        <img src={imageSrc} alt={title} />
                                    </div>
                                </header>
                                <p className="subscriptionTable-description aligncenter mt0 mb1 italic">
                                    {description}
                                </p>
                                <ul className="unstyled small mb2 flex-item-fluid-auto">
                                    {features.map((feature, index) => {
                                        return (
                                            <li className="subscriptionTable-feature" key={index}>
                                                {feature}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <footer className="subscriptionTable-footer aligncenter flex flex-column">
                                    {index === currentPlanIndex && !canCustomize ? (
                                        selected
                                    ) : (
                                        <Button
                                            className={classnames([index !== currentPlanIndex && 'pm-button--primary'])}
                                            onClick={() => onSelect(index)}
                                        >
                                            {index === currentPlanIndex ? update : select}
                                        </Button>
                                    )}
                                    {canCustomize ? (
                                        <LinkButton
                                            className="subscriptionTable-customize-button"
                                            onClick={() => onSelect(index, true)}
                                        >{c('Action').t`Customize`}</LinkButton>
                                    ) : null}
                                </footer>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

SubscriptionTable.propTypes = {
    currentPlan: PropTypes.string,
    plans: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            price: PropTypes.node.isRequired,
            imageSrc: PropTypes.string.isRequired,
            description: PropTypes.node.isRequired,
            features: PropTypes.arrayOf(PropTypes.node).isRequired
        })
    ),
    onSelect: PropTypes.func.isRequired,
    currentPlanIndex: PropTypes.number,
    mostPopularIndex: PropTypes.number,
    selected: PropTypes.string,
    update: PropTypes.string,
    select: PropTypes.string
};

export default SubscriptionTable;
