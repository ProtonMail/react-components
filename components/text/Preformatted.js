import React from 'react';
import PropTypes from 'prop-types';

const Preformatted = ({ className, ...rest }) => {
    return <pre style={{ overflow: 'auto' }} className={`bg-global-muted p0-5 m0 ${className}`} {...rest} />;
};

Preformatted.propTypes = {
    className: PropTypes.string
};

Preformatted.defaultProps = {
    className: ''
};

export default Preformatted;
