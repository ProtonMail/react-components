import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Label, Field } from 'react-components';
import { c } from 'ttag';

import { getTimeZoneOptions } from '../../utils';

const TimeZoneField = ({ value, onChange }) => {
    const handleChange = ({ target }) => onChange(target.value);

    const options = useMemo(() => {
        return getTimeZoneOptions();
    }, []);

    return (
        <Row>
            <Label htmlFor="timezone">{c('Label').t`Timezone`}</Label>
            <Field>
                <Select id="timezone" options={options} onChange={handleChange} value={value} />
            </Field>
        </Row>
    );
};

TimeZoneField.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default TimeZoneField;
