import React from 'react';
import PropTypes from 'prop-types';

const Href = ({ url, className, children }) => {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
};

Href.propTypes = {
    url: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

Href.defaultProps = {
    url: '#'
};

export default Href;
