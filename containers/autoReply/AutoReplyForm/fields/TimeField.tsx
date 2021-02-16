import React from 'react';

import { Row, Label, Field, TimeInput } from '../../../../components';

interface Props {
    id: string;
    label: string;
    value?: Date;
    onChange: (date: Date) => void;
}

const TimeField = ({ id, label, value = new Date(), onChange }: Props) => {
    return (
        <Row>
            <Label htmlFor={id} className="w16r text-semibold">
                {label}
            </Label>
            <Field>
                <TimeInput id={id} value={value} onChange={onChange} />
            </Field>
        </Row>
    );
};

export default TimeField;
