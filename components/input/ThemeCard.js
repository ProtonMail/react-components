import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { RadioCard, Href } from 'react-components';

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
            <br />
            <br />
            <div className="flex flex-spacebetween">
                <div>
                    <Href url={themeObject.previewURL}>{c('Preview theme').t`Preview`}</Href>
                </div>
                <div>
                    <Href url={themeObject.deleteURL}>{c('Delete theme').t`Delete`}</Href>
                </div>
            </div>
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
