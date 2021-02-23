import React from 'react';
import { c } from 'ttag';

import { getDurationOptions } from '../../utils';
import { Select, Label, Row, Field } from '../../../../components';

interface Props {
    value: number;
    onChange: Function;
}

const DurationField = ({ value, onChange }: Props) => {
    const handleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => onChange(+target.value);

    return (
        <Row>
            <Label htmlFor="duration" className="w16r text-bold">{c('Label').t`Duration`}</Label>
            <Field>
                <Select id="duration" value={value} onChange={handleChange} options={getDurationOptions()} />
            </Field>
        </Row>
    );
};

export default DurationField;
