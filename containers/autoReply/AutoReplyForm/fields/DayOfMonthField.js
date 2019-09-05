import React, { useMemo } from 'react';
import { Row, Label, Field, Select } from 'react-components';
import PropTypes from 'prop-types';
import { dateLocale } from 'proton-shared/lib/i18n';

import { getDaysOfMonthOptions } from '../../utils';

const DayOfMonthField = ({ id, label, value, onChange }) => {
    const handleChange = ({ target }) => onChange(+target.value);

    const options = useMemo(() => {
        return getDaysOfMonthOptions({ locale: dateLocale });
    }, [dateLocale]);

    return (
        <Row>
            <Label htmlFor={id}>{label}</Label>
            <Field>
                <Select id={id} options={options} value={value} onChange={handleChange} />
            </Field>
        </Row>
    );
};

DayOfMonthField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default DayOfMonthField;
