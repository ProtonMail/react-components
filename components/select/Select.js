import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { generateUID } from '../../helpers/component';
import useInput from '../input/useInput';
import ErrorZone from '../text/ErrorZone';

const Select = ({
    options,
    error,
    disabled,
    size = 1,
    className = '',
    multiple = false,
    onChange,
    onBlur,
    onFocus,
    ...rest
}) => {
    const { handlers, statusClasses, status } = useInput({ onFocus, onBlur, onChange, disabled, ...rest });
    const [uid] = useState(generateUID('select'));

    return (
        <>
            <select
                className={`pm-field w100 ${className} ${statusClasses}`}
                disabled={disabled}
                size={size}
                multiple={multiple}
                {...handlers}
            >
                {options.map(({ text, ...rest }, index) => (
                    <option key={index.toString()} {...rest}>
                        {text}
                    </option>
                ))}
            </select>
            <ErrorZone id={uid}>{error && status.isDirty ? error : ''}</ErrorZone>
        </>
    );
};

Select.propTypes = {
    error: PropTypes.string,
    disabled: PropTypes.bool,
    size: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    multiple: PropTypes.bool,
    className: PropTypes.string
};

export default Select;
