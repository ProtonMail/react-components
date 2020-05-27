import React, { useState, FormEvent, ChangeEvent } from 'react';
import { FormModal, Alert, Row, Label, Field, Input } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Filter, Step } from './interfaces';
import HeaderFilterModal from './HeaderFilterModal';
import FooterFilterModal from './FooterFilterModal';

interface Props {
    filter?: Filter;
    onClose: () => void;
}

const FilterModal = ({ filter, ...rest }: Props) => {
    const [model, setModel] = useState<ModalModel>({
        step: Step.NAME,
        name: filter?.Name || ''
    });
    const title = '';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <FormModal
            title={title}
            onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
            footer={<FooterFilterModal model={model} onChange={setModel} onClose={rest.onClose} />}
            {...rest}
        >
            <HeaderFilterModal model={model} onChange={setModel} />
            {model.step === Step.NAME ? (
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
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    setModel({ ...model, name: target.value })
                                }
                                autoFocus={true}
                                required
                            />
                        </Field>
                    </Row>
                </>
            ) : null}
            {model.step === Step.CONDITIONS ? <>TODO</> : null}
            {model.step === Step.ACTIONS ? <>TODO</> : null}
            {model.step === Step.PREVIEW ? <>TODO</> : null}
        </FormModal>
    );
};

export default FilterModal;
