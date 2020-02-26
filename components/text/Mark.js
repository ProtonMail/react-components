import React from 'react';
import PropTypes from 'prop-types';

const Mark = ({ children, value }) => {
    if (!value) {
        return children;
    }

    const splitted = children.split(value);

    if (splitted.length < 2) {
        // Not found
        return children;
    }

    return splitted.reduce((acc, v, index) => {
        acc.push(v);
        if (index < splitted.length - 1) {
            acc.push(<mark>{value}</mark>);
        }
        return acc;
    }, []);
};

Mark.propTypes = {
    children: PropTypes.string.isRequired,
    value: PropTypes.string
};

export default Mark;
