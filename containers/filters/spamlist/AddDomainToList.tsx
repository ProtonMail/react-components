import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Input, Label, Row, Field } from 'react-components';
import { DOMAIN_PLACEHOLDER } from 'proton-shared/lib/constants';

interface Props {
    domain: string;
    onChange: (newDomain: string) => void;
}

const AddDomainToList = ({ domain, onChange }: Props) => {
    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => onChange(target.value);
    return (
        <Row>
            <Label htmlFor="domain">{c('Label').t`Domain`}</Label>
            <Field>
                <Input
                    id="domain"
                    value={domain}
                    onChange={handleChange}
                    placeholder={DOMAIN_PLACEHOLDER}
                    required={true}
                    autoFocus={true}
                />
            </Field>
        </Row>
    );
};

export default AddDomainToList;
