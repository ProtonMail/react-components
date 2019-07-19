import React from 'react';
import PropTypes from 'prop-types';
import { Row, Label, DateInput, Field } from 'react-components';
import { c } from 'ttag';
import moment from 'moment';

const StartDateField = ({ value, onChange }) => {
    const handleChange = (date) =>
        onChange(
            moment(date)
                .utc(true)
                .startOf('day')
                .valueOf()
        );

    return (
        <Row className="flex-spacebetween">
            <Label htmlFor="startDate">{c('Label').t`Start date`}</Label>
            <Field>
                <DateInput
                    id="startDate"
                    className="w100"
                    defaultDate={new Date(value)}
                    setDefaultDate
                    onSelect={handleChange}
                    format={moment.localeData().longDateFormat('L')}
                />
            </Field>
        </Row>
    );
};

StartDateField.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default StartDateField;
