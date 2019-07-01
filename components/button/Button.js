import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Icon from '../icon/Icon';

const Button = ({
    type,
    role,
    loading,
    tabIndex,
    buttonRef,
    className,
    children,
    title,
    disabled,
    onClick,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
    icon,
    ...rest
}) => {
    const handleClick = (event) => {
        if (!disabled && onClick) {
            onClick(event);
        }
    };

    const handleKeyDown = (event) => {
        const key = keycode(event);

        if (onKeyDown) {
            onKeyDown(event);
        }

        if (event.target === event.currentTarget && (key === 'space' || key === 'enter')) {
            event.preventDefault();

            if (onClick) {
                onClick(event);
            }
        }
    };

    const handleKeyUp = (event) => {
        if (onKeyUp) {
            onKeyUp(event);
        }
    };

    const handleFocus = (event) => {
        if (disabled) {
            return;
        }

        if (onFocus) {
            onFocus(event);
        }
    };

    const handleBlur = (event) => {
        if (onBlur) {
            onBlur(event);
        }
    };

    const iconComponent = typeof icon === 'string' ? <Icon name={icon} /> : icon;
    const iconButtonClass = !children ? 'pm-button--for-icon' : '';

    return (
        <button
            role={role}
            disabled={loading ? true : disabled}
            className={`pm-button ${iconButtonClass} ${className}`}
            type={type}
            tabIndex={disabled ? '-1' : tabIndex}
            title={title}
            ref={buttonRef}
            onClick={handleClick}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            aria-busy={loading}
            {...rest}
        >
            {iconComponent}
            {children}
        </button>
    );
};

Button.propTypes = {
    loading: PropTypes.bool,
    role: PropTypes.string,
    tabIndex: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    buttonRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node
};

Button.defaultProps = {
    role: 'button',
    type: 'button',
    disabled: false,
    loading: false,
    className: ''
};

export default Button;
