import React from 'react';
import { isValid } from 'date-fns';
import { Row, Label, DateInput, Field } from '../../../../components';

interface Props {
    id: string;
    label: string;
    value?: Date;
    min?: Date;
    max?: Date;
    onChange: (value?: Date) => void;
}

const DateField = ({ id, label, value = new Date(), onChange, min, max }: Props) => {
    return (
        <Row>
            <Label htmlFor={id} className="w16r text-semibold">
                {label}
            </Label>
            <Field>
                <DateInput
                    id={id}
                    className="w100"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(value) => {
                        if (isValid(value)) {
                            onChange(value);
                        }
                    }}
                />
            </Field>
        </Row>
    );
};

export default DateField;
