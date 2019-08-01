import React from 'react';
import PropTypes from 'prop-types';

// TODO: rename to DropdownMenuButton and DropdownAnchorButton to DropdownButton
const DropdownButton = ({ className = '', children, ...rest }) => {
    return (
        <button className={`w100 pt0-5 pb0-5 ${className}`} {...rest}>
            {children}
        </button>
    );
};

DropdownButton.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default DropdownButton;
