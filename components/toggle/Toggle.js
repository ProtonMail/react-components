import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';

import Input from '../input/Input';
import Icon from '../icon/Icon';

const label = (key) => {
    const I18N = {
        on: c('Toggle button').t`On`,
        off: c('Toggle button').t`Off`
    };

    return (
        <span className="pm-toggle-label-text">
            <Icon name={key} alt={I18N[key]} className="pm-toggle-label-img" />
        </span>
    );
};

const Toggle = ({ id, checked, onChange }) => {
    const [value, setValue] = useState(checked);

    /*
        If you change the checked from the outside -> ex update the prop outside
        we update the local state with the new value.
    */
    useEffect(() => {
        setValue(checked);
    }, [checked]);
    return (
        <>
            <Input
                type="checkbox"
                id={id}
                checked={value}
                className="pm-toggle-checkbox"
                onChange={() => (setValue(!value), onChange(value))}
            />
            <label htmlFor={id} className="pm-toggle-label">
                {label('on')}
                {label('off')}
            </label>
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
    type: 'text',
    checked: false
};

export default Toggle;
