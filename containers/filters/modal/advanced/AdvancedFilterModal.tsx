import React, { useState, FormEvent, useMemo } from 'react';
import { c } from 'ttag';
import { FormModal, useLoading, useApi, useFilters, useMailSettings } from 'react-components';
import { normalize } from 'proton-shared/lib/helpers/string';

import FilterNameForm from '../FilterNameForm';
import { Filter } from '../interfaces';
import { Step, ModalModel, Errors } from './interfaces';
import HeaderAdvancedFilterModal from './HeaderAdvancedFilterModal';
import FooterAdvancedFilterModal from './FooterAdvancedFilterModal';
import SieveForm from './SieveForm';

interface Props {
    filter: Filter;
    onClose: () => void;
}

const AdvancedFilterModal = ({ filter, ...rest }: Props) => {
    const [loading, withLoading] = useLoading();
    const [filters = []] = useFilters();
    const [mailSettings] = useMailSettings();
    const api = useApi();
    const title = filter?.ID ? c('Title').t`Edit filter` : c('Title').t`Add filter`;
    const [model, setModel] = useState<ModalModel>({
        step: Step.NAME,
        sieve: filter?.Sieve || '',
        name: filter?.Name || ''
    });

    const errors = useMemo<Errors>(() => {
        return {
            name: !model.name
                ? c('Error').t`This field is required`
                : filters.find(({ Name }: Filter) => normalize(Name) === normalize(model.name))
                ? c('Error').t`Filter with this name already exist`
                : '',
            sieve: model.sieve ? '' : c('Error').t`This field is required`
        };
    }, [model.name, model.sieve]);

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
                <FooterAdvancedFilterModal
                    model={model}
                    errors={errors}
                    onChange={setModel}
                    onClose={rest.onClose}
                    loading={loading}
                />
            }
            {...rest}
        >
            <HeaderAdvancedFilterModal model={model} errors={errors} onChange={setModel} />
            {model.step === Step.NAME ? <FilterNameForm model={model} onChange={setModel} errors={errors} /> : null}
            {model.step === Step.SIEVE ? (
                <SieveForm model={model} onChange={setModel} errors={errors} mailSettings={mailSettings} />
            ) : null}
        </FormModal>
    );
};

export default AdvancedFilterModal;
