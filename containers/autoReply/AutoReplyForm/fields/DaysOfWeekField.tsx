import React from 'react';
import { c } from 'ttag';

import { getFormattedWeekdays } from 'proton-shared/lib/date/date';
import { dateLocale } from 'proton-shared/lib/i18n';

import { Label, Checkbox, Row, Field } from '../../../../components';

interface Props {
    value: number[];
    onChange: (days: number[]) => void;
}

const DaysOfWeekField = ({ value, onChange }: Props) => {
    const handleChange = (weekday: number) => () =>
        onChange(value.includes(weekday) ? value.filter((existing) => weekday !== existing) : [...value, weekday]);

    return (
        <Row>
            <Label className="w16r text-bold">{c('Label').t`Days of the week`}</Label>
            <Field>
                <div className="flex flex-column">
                    {getFormattedWeekdays('iiii', { locale: dateLocale }).map((text, i) => (
                        <Checkbox id={`weekday-${i}`} key={text} checked={value.includes(i)} onChange={handleChange(i)}>
                            {text}
                        </Checkbox>
                    ))}
                </div>
            </Field>
        </Row>
    );
};

export default DaysOfWeekField;
