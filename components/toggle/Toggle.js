import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';

import Input from '../input/Input';
import Label from '../label/Label';
import Icon from '../icon/Icon';

const label = (type, key) => {
    const I18N = {
        on: c('Toggle button').t`On`,
        off: c('Toggle button').t`Off`
    };

    if (type === 'icon') {
        return (
            <span className="pm-toggle-label-text">
                <Icon name={key} alt={I18N[key]} />
            </span>
        );
    }

    if (key === 'on') {
        return <span className="pm-toggle-label-text">{I18N[key]}</span>;
    }

    return <span className="pm-toggle-label-text">{I18N[key]}</span>;
};

const Toggle = ({ id, checked, onChange, type }) => {
    const [value, setValue] = useState(checked);
    return (
        <>
            <Input
                type="checkbox"
                id={id}
                checked={value}
                className="pm-toggle-checkbox"
                onChange={() => onChange(value)}
            />
            <Label htmlFor={id} className="pm-toggle-label" onClick={() => setValue(!value)}>
                {label(type, 'on')}
                {label(type, 'off')}
            </Label>
        </>
    );
};

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

Toggle.defaultProps = {
    id: 'toggle',
    type: 'text'
};

export default Toggle;
