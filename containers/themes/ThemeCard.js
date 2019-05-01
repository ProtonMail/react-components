import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { RadioCard } from 'react-components';

const ThemeCard = ({ label, id, value, alt, src, checked, onChange, disabled, customizable, onCustomization }) => {
    const customize = customizable ? (
        <>
            <br />
            <span className="link" onClick={onCustomization}>
                Customize
            </span>
        </>
    ) : (
        <>
            <br />
            <span className="inbl" />
        </>
    );

    return (
        <RadioCard
            label={c('Theme label').t`${label}`}
            name="themeCard"
            id={id}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        >
            <img alt={alt} src={src} />
            {customize}
        </RadioCard>
    );
};

ThemeCard.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    alt: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    customizable: PropTypes.bool,
    onChange: PropTypes.func,
    onCustomization: PropTypes.func
};

ThemeCard.defaultProps = {
    customizable: false
};

export default ThemeCard;
