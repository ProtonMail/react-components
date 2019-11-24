import React from 'react';
import PropTypes from 'prop-types';
import { useToggle, Button, classnames, LinkButton } from 'react-components';
import { c } from 'ttag';

const SubscriptionTable = ({ plans, onSelect, currentPlanIndex = 0, mostPopularIndex = 0 }) => {
    const { state: showAllFeatures, toggle: toggleFeatures } = useToggle(false);

    return (
        <div className="bordered-container">
            <div className="flex flex-nowrap">
                {plans.map(({ planName, price, imageSrc, description, features = [] }, index) => {
                    return (
                        <div
                            key={planName}
                            className="pt2 pb2 pl1 pr1 border-right"
                            data-current-plan={index === currentPlanIndex}
                            data-most-popular={index === mostPopularIndex}
                        >
                            {index === mostPopularIndex ? (
                                <div className="mb0-5">{c('Title for subscription plan').t`Most popular`}</div>
                            ) : null}
                            <div className="bold aligncenter mb0-5">{planName}</div>
                            <div className="aligncenter mb0-5">{price}</div>
                            <div className="aligncenter">
                                <img src={imageSrc} alt={planName} />
                            </div>
                            <p className="aligncenter mb1">{description}</p>
                            <ul className="small mb1">
                                {features
                                    .filter(({ advanced = false }) => {
                                        if (!advanced) {
                                            return true;
                                        }
                                        return showAllFeatures;
                                    })
                                    .map(({ feature }, index) => {
                                        return <li key={index}>{feature}</li>;
                                    })}
                            </ul>
                            <div className="aligncenter">
                                <Button
                                    className={classnames([index !== currentPlanIndex && 'pm-button--primary'])}
                                    onClick={() => onSelect(index)}
                                >
                                    {index === currentPlanIndex ? c('Action').t`Customize` : c('Action').t`Select`}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {showAllFeatures ? (
                <div className="aligncenter p1 border-top">
                    <LinkButton onClick={toggleFeatures}>{c('Action').t`Compare all features`}</LinkButton>
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
            features: PropTypes.arrayOf(
                PropTypes.shape({
                    feature: PropTypes.node.isRequired,
                    advanced: PropTypes.bool
                })
            )
        })
    ),
    onSelect: PropTypes.func.isRequired,
    currentPlanIndex: PropTypes.number,
    mostPopularIndex: PropTypes.number
};

export default SubscriptionTable;
