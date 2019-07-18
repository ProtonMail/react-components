import React from 'react';
import PropTypes from 'prop-types';

const Radio = ({ id, children, className, cypressTag, ...rest }) => {
    return (
        <label htmlFor={id} className={className}>
            <input id={id} type="radio" className="pm-radio" {...rest} />
            <span className="pm-radio-fakeradio" {...cypressTag} />
            {children}
        </label>
    );
};

Radio.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
};

export default Radio;
