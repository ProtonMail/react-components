import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { RadioCard } from 'react-components';

const ThemeCard = ({ checked, themeObject, onChange, disabled }) => {
    return (
        <RadioCard
            label={c('Theme label').t`${themeObject.label}`}
            name="themeCard"
            id={themeObject.id}
            value={themeObject.value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        >
            <img alt={themeObject.alt} src={themeObject.src} />
        </RadioCard>
    );
};

ThemeCard.propTypes = {
    themeObject: PropTypes.object,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default ThemeCard;
