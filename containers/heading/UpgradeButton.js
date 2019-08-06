import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { c } from 'ttag';

import { Icon } from 'react-components';

const UpgradeButton = ({ className }) => {
    return (
        <Link to="/settings/subscription" className={className}>
            <Icon name="upgrade-to-paid" className="topnav-icon mr0-5 flex-item-centered-vert fill-white" />
            {c('Link').t`Upgrade`}
        </Link>
    );
};

UpgradeButton.propTypes = {
    className: PropTypes.string
};

export default UpgradeButton;
