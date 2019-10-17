import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Link } from 'react-components';

const MobileNavLink = ({ icon = '', to = '', external = false }) => {
    return (
        <Link to={to} external={external} className="mr1">
            <Icon name={icon} />
        </Link>
    );
};

MobileNavLink.propTypes = {
    icon: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    external: PropTypes.bool
};

export default MobileNavLink;
