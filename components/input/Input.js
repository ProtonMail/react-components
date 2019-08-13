import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { generateUID } from '../../helpers/component';
import useInput from './useInput';
import ErrorZone from '../text/ErrorZone';

const Input = React.forwardRef(
    (
        {
            error,
            autoComplete = 'off',
            autoFocus,
            className = '',
            disabled,
            id,
            name,
            onBlur,
            onChange,
            onFocus,
            onKeyDown,
            onKeyUp,
            onPressEnter,
            placeholder,
            readOnly,
            required,
            type = 'text',
            value
        },
        ref
    ) => {
        const { handlers, statusClasses, status } = useInput({
            onFocus,
            onBlur,
            onChange,
            onPressEnter,
            onKeyDown,
            disabled
        });
        const [uid] = useState(generateUID('input'));

        return (
            <>
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    className={`pm-field w100 ${className} ${statusClasses}`}
                    aria-invalid={error && status.isDirty}
                    aria-describedby={uid}
                    ref={ref}
                    onKeyUp={onKeyUp}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    {...handlers}
                />
                <ErrorZone id={uid}>{error && status.isDirty ? error : ''}</ErrorZone>
            </>
        );
    }
);

Input.propTypes = {
    error: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onPressEnter: PropTypes.func,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Input;
