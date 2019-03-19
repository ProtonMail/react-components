import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { RadioCard, Href } from 'react-components';

const ThemeCard = ({ checked, theme, onChange, disabled }) => {
    return (
        <RadioCard
            label={c('Theme label').t`theme.label`}
            name="themeCard"
            id={theme.id}
            value={theme.value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        >
            <img alt={theme.alt} src={theme.src} />
            <br />
            <br />
            <Href url={theme.previewURL}>{c('Preview theme').t`Preview`}</Href>
        </RadioCard>
    );
};

ThemeCard.propTypes = {
    theme: PropTypes.object,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default ThemeCard;
