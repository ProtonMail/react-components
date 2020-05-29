import React, { useState, useMemo, FormEvent } from 'react';
import { FormModal, useLoading, /* useApi, */ useFilters } from 'react-components';
import { c } from 'ttag';
import { normalize } from 'proton-shared/lib/helpers/string';

import { ModalModel, Filter, Step, Errors } from './interfaces';
import FilterNameForm from './FilterNameForm';
import HeaderFilterModal from './HeaderFilterModal';
import FooterFilterModal from './FooterFilterModal';
import FilterConditionsForm from './FilterConditionsForm';

interface Props {
    filter?: Filter;
    onClose: () => void;
}

const FilterModal = ({ filter, ...rest }: Props) => {
    // const api = useApi();
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
        // @todo submit once everything is ok
        // await api();
    };

    const renderStep = () => {
        switch (model.step) {
            case Step.NAME:
                return <FilterNameForm model={model} onChange={setModel} errors={errors} />;
            case Step.CONDITIONS:
                return <FilterConditionsForm />;
            case Step.ACTIONS:
                return <>TODO</>;
            case Step.PREVIEW:
                return <>TODO</>;
            default:
                return null;
        }
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
            {renderStep()}
        </FormModal>
    );
};

export default FilterModal;
