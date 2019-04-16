import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';

const DateInput = ({ onChange: onSelect, disabled, ...rest }) => {
    const inputRef = useRef();

    useEffect(() => {
        const picker = new Pikaday({
            field: inputRef.current,
            onSelect,
            ...rest
        });

        return picker.destroy;
    });

    return <input className="pm-field" disabled={disabled} ref={inputRef} type="text" />; // Using type="text" as recommended by Pikaday (https://github.com/Pikaday/Pikaday)
};

DateInput.propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default DateInput;
