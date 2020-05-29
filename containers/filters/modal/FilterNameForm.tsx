import React, { ChangeEvent } from 'react';
import { Alert, Label, Row, Field, Input } from 'react-components';
import { c } from 'ttag';
import { ModalModel } from './interfaces';

interface Errors {
    name: string;
}

interface Props {
    model: ModalModel;
    errors: Errors;
    onChange: (newModel: ModalModel) => void;
}

const FilterNameForm = ({ model, errors, onChange }: Props) => {
    return (
        <>
            <Alert>{c('Info')
                .t`Filters work on all emails, including incoming as well as sent emails. Each filter must contain at least a name, a condition and an action to be saved.`}</Alert>
            <Row>
                <Label htmlFor="name">{c('Label').t`Filter name`}</Label>
                <Field>
                    <Input
                        id="name"
                        placeholder={c('Placeholder').t`Name`}
                        value={model.name}
                        error={errors.name}
                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                            onChange({ ...model, name: target.value })
                        }
                        autoFocus={true}
                        required
                    />
                </Field>
            </Row>
        </>
    );
};

export default FilterNameForm;
