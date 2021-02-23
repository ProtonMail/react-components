import React from 'react';

import { Row, Label, Field, Select } from '../../../../components';
import { getDaysOfMonthOptions } from '../../utils';

interface Props {
    id: string;
    label: string;
    value: number;
    onChange: Function;
}

const DayOfMonthField = ({ id, label, value, onChange }: Props) => {
    const handleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => onChange(+target.value);

    return (
        <Row>
            <Label htmlFor={id} className="w16r text-bold">
                {label}
            </Label>
            <Field>
                <Select id={id} options={getDaysOfMonthOptions()} value={value} onChange={handleChange} />
            </Field>
        </Row>
    );
};

export default DayOfMonthField;
