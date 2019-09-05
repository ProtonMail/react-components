import React from 'react';
import PropTypes from 'prop-types';
import readableTime from 'proton-shared/lib/helpers/readableTime';

const Time = ({ children = 0, format = 'PP', options, ...rest }) => (
    <time {...rest}>{readableTime(children, format, options)}</time>
);

Time.propTypes = {
    children: PropTypes.number.isRequired,
    format: PropTypes.string,
    options: PropTypes.object.isRequired
};

export default Time;
