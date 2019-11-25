import React from 'react';
import PropTypes from 'prop-types';
import { useToggle, Button, classnames, LinkButton } from 'react-components';
import { c } from 'ttag';

const SubscriptionTable = ({ plans, onSelect, currentPlanIndex = 0, mostPopularIndex = 0 }) => {
    const { state: showAllFeatures, toggle: toggleFeatures } = useToggle(false);

    return (
        <div className="bordered-container">
            <div className="flex flex-nowrap border-bottom">
                {plans.map(({ planName, price, imageSrc, description, features = [] }, index) => {
                    return (
                        <div
                            key={planName}
                            className={classnames(['pt2 pb2 pl1 pr1', index && 'border-left'])}
                            data-current-plan={index === currentPlanIndex}
                            data-most-popular={index === mostPopularIndex}
                        >
                            {index === mostPopularIndex ? (
                                <div className="mb0-5 aligncenter capitalize">{c('Title for subscription plan')
                                    .t`Most popular`}</div>
                            ) : null}
                            <div className="bold aligncenter mb0-5 capitalize">{planName}</div>
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
            <div className="aligncenter p1">
                <LinkButton onClick={toggleFeatures}>
                    {showAllFeatures ? c('Action').t`Display less features` : c('Action').t`Compare all features`}
                </LinkButton>
            </div>
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
