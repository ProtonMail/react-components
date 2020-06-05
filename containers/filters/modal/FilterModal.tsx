import React, { useState, useMemo, FormEvent } from 'react';
import { c } from 'ttag';

import {
    FormModal,
    useLoading,
    /* useApi, */
    useLabels,
    useFolders,
    useActiveBreakpoint,
    useFilters
} from 'react-components';
import { normalize } from 'proton-shared/lib/helpers/string';

import { FilterModalModel, Filter, Step, Errors, Condition, Actions } from './interfaces';
import HeaderFilterModal from './HeaderFilterModal';
import FooterFilterModal from './FooterFilterModal';
import FilterNameForm from './FilterNameForm';
import FilterActionsForm from './FilterActionsForm';
import FilterConditionsForm from './FilterConditionsForm';

interface Props {
    filter?: Filter;
    onClose: () => void;
}

const checkNameErrors = (filters: Filter[], name: string) => {
    if (!name) {
        return c('Error').t`This field is required`;
    }
    if (filters.find(({ Name }: Filter) => normalize(Name) === normalize(name))) {
        return c('Error').t`Filter with this name already exist`;
    }
    return '';
};

const checkConditionsErrors = (conditions: Condition[]) => {
    if (conditions.some((c) => !!c.error)) {
        return c('Error').t`Error in one of the condition(s)`;
    }
    if (!conditions.length) {
        return c('Error').t`Require at least one condition`;
    }
    return '';
};

const checkActionsErrors = (actions: Actions) => {
    const { labelAs, markAs, moveTo, autoReply } = actions;

    if (!labelAs.labels.length && !moveTo.folder && !markAs.read && !markAs.starred && !autoReply) {
        return c('Error').t`Require at least one action`;
    }
    return '';
};

const FilterModal = ({ filter, ...rest }: Props) => {
    // const api = useApi();
    const { isNarrow } = useActiveBreakpoint();
    const [filters = []] = useFilters();
    const [labels, loadingLabels] = useLabels();
    const [folders, loadingFolders] = useFolders();

    const [loading, withLoading] = useLoading();
    const [model, setModel] = useState<FilterModalModel>({
        step: Step.NAME,
        name: filter?.Name || '',
        conditions: [],
        actions: {
            labelAs: {
                labels: [],
                isOpen: true
            },
            moveTo: {
                isOpen: true
            },
            markAs: {
                read: false,
                starred: false,
                isOpen: true
            },
            autoReply: ''
        }
    });
    const title = filter?.ID ? c('Title').t`Edit filter` : c('Title').t`Add filter`;

    const { name, conditions, actions } = model;

    const errors = useMemo<Errors>(() => {
        return {
            name: checkNameErrors(filters, name),
            conditions: checkConditionsErrors(conditions),
            actions: checkActionsErrors(actions)
        };
    }, [name, actions, conditions]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // @todo submit once everything is ok
        // await api();
    };

    const renderStep = () => {
        switch (model.step) {
            case Step.NAME:
                return <FilterNameForm isNarrow={isNarrow} model={model} onChange={setModel} errors={errors} />;
            case Step.CONDITIONS:
                return <FilterConditionsForm isNarrow={isNarrow} model={model} onChange={setModel} />;
            case Step.ACTIONS:
                return (
                    <FilterActionsForm
                        labels={labels || []}
                        folders={folders || []}
                        isNarrow={isNarrow}
                        model={model}
                        onChange={setModel}
                    />
                );
            case Step.PREVIEW:
                return <>TODO</>;
            default:
                return null;
        }
    };

    return (
        <FormModal
            title={title}
            loading={loading || loadingLabels || loadingFolders}
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
