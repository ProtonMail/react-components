import React, { useState, FormEvent, useMemo, useEffect } from 'react';
import { c } from 'ttag';
import { FormModal, useLoading, useApi, useFilters, useMailSettings, useDebounceInput } from 'react-components';
import { FILTER_VERSION } from 'proton-shared/lib/constants';
import { normalize } from 'proton-shared/lib/helpers/string';
import { checkSieveFilter } from 'proton-shared/lib/api/filters';

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
        name: filter?.Name || '',
        issues: []
    });
    const sieve = useDebounceInput(model.sieve);

    const errors = useMemo<Errors>(() => {
        return {
            name: !model.name
                ? c('Error').t`This field is required`
                : filters.find(({ Name }: Filter) => normalize(Name) === normalize(model.name))
                ? c('Error').t`Filter with this name already exist`
                : '',
            sieve: model.sieve
                ? model.issues.length
                    ? c('Error').t`Invalid sieve code`
                    : ''
                : c('Error').t`This field is required`
        };
    }, [model.name, model.sieve, model.issues]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await api(); // TODO
    };

    const checkSieve = async () => {
        const { Issues = [] } = await api(checkSieveFilter({ Version: FILTER_VERSION, Sieve: sieve }));
        setModel({
            ...model,
            issues: Issues.length ? Issues : []
        });
    };

    useEffect(() => {
        if (sieve) {
            withLoading(checkSieve());
        } else {
            setModel({ ...model, issues: [] });
        }
    }, [sieve]);

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
