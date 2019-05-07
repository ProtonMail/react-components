import React from 'react';
import PropTypes from 'prop-types';

const Field = ({ children, className }) => {
    return <span className={`pm-field-container ${className}`}>{children}</span>;
};

Field.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

Field.defaultProps = {
    className: ''
};

export default Field;
