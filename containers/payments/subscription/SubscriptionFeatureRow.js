import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Info } from 'react-components';

const SubscriptionFeatureRow = ({ icon, feature, info }) => {
    return (
        <div className="flex flex-nowrap flex-items-center">
            <Icon name={icon} className="mr1" />
            {feature}
            {info ? <Info title={info} /> : null}
        </div>
    );
};

SubscriptionFeatureRow.propTypes = {
    icon: PropTypes.string.isRequired,
    feature: PropTypes.node.isRequired,
    info: PropTypes.string
};

export default SubscriptionFeatureRow;
