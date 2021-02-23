import React, { useMemo } from 'react';
import { c } from 'ttag';

import { getTimeZoneOptions } from 'proton-shared/lib/date/timezone';

import { Select, Row, Label, Field } from '../../../../components';

interface Props {
    value: string;
    onChange: Function;
}

const TimeZoneField = ({ value, onChange }: Props) => {
    const handleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => onChange(target.value);

    const options = useMemo(() => {
        return getTimeZoneOptions();
    }, []);

    return (
        <Row>
            <Label htmlFor="timezone" className="w16r text-bold">{c('Label').t`Timezone`}</Label>
            <Field>
                <Select id="timezone" options={options} onChange={handleChange} value={value} />
            </Field>
        </Row>
    );
};

export default TimeZoneField;
