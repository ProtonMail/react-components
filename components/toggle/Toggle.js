import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'ttag';

import Input from '../input/Input';
import Label from '../label/Label';

const Toggle = ({ id, checked, onChange }) => {
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
                <span className="pm-toggle-label-text">{t`On`}</span>
                <span className="pm-toggle-label-text">{t`Off`}</span>
            </Label>
        </>
    );
};

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

Toggle.defaultProps = {
    id: 'toggle'
};

export default Toggle;
