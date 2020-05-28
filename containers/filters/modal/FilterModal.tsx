import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';
import { FormModal, Alert, Row, Label, Field, Input, useLoading, useApi, useFilters } from 'react-components';
import { c } from 'ttag';
import { normalize } from 'proton-shared/lib/helpers/string';

import { ModalModel, Filter, Step, Errors } from './interfaces';
import HeaderFilterModal from './HeaderFilterModal';
import FooterFilterModal from './FooterFilterModal';

interface Props {
    filter?: Filter;
    onClose: () => void;
}

const FilterModal = ({ filter, ...rest }: Props) => {
    const api = useApi();
    const [filters = []] = useFilters();
    const [loading, withLoading] = useLoading();
    const [model, setModel] = useState<ModalModel>({
        step: Step.NAME,
        name: filter?.Name || '',
        conditions: [],
        actions: []
    });
    const title = filter?.ID ? c('Title').t`Edit filter` : c('Title').t`Add filter`;
    const errors = useMemo<Errors>(() => {
        return {
            name: !model.name
                ? c('Error').t`This field is required`
                : filters.find(({ Name }: Filter) => normalize(Name) === normalize(model.name))
                ? c('Error').t`Filter with this name already exist`
                : '',
            actions: model.actions.length ? '' : c('Error').t`Require at least one action`,
            conditions: model.conditions.length ? '' : c('Error').t`Require at least one condition`
        };
    }, [model.name, model.actions, model.conditions]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await api(); // TODO
    };

    return (
        <FormModal
            title={title}
            loading={loading}
            onSubmit={(event: FormEvent<HTMLFormElement>) => withLoading(handleSubmit(event))}
            footer={
                <FooterFilterModal
                    model={model}
                    errors={errors}
                    onChange={setModel}
                    onClose={rest.onClose}
                    loading={loading}
                />
            }
            {...rest}
        >
            <HeaderFilterModal model={model} errors={errors} onChange={setModel} />
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
                                error={errors.name}
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
