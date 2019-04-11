import React from 'react';
import PropTypes from 'prop-types';

const InputFile = ({ children, id, className, ...rest }) => {
    return (
        <label className={'pm-button '.concat(className || '')} htmlFor={id}>
            <input id={id} type="file" className="hidden" {...rest} />
            {children}
        </label>
    );
};

InputFile.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default InputFile;
