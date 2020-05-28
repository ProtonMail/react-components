import React, { useMemo } from 'react';
import { Group, ButtonGroup, RoundedIcon, useFilters } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step, Filter } from './interfaces';

interface Props {
    model: ModalModel;
    onChange: (newModel: ModalModel) => void;
}

const normalizeFilterName = (name = '') => name.trim().toLowerCase();

const HeaderFilterModal = ({ model, onChange }: Props) => {
    const [filters = []] = useFilters();
    const filtersMap = useMemo(() => {
        return filters.reduce((acc: { [filterName: string]: Filter }, filter: Filter) => {
            acc[normalizeFilterName(filter.Name)] = filter;
            return acc;
        }, {});
    }, [filters]);
    const hasValidName = model.name && !filtersMap[normalizeFilterName(model.name)];

    return (
        <header className="mb1">
            <Group>
                <ButtonGroup
                    onClick={() => onChange({ ...model, step: Step.NAME })}
                    className={model.step === Step.NAME ? 'is-active' : ''}
                >
                    {hasValidName ? <RoundedIcon className="mr0-5" type="success" name="on" /> : null}
                    {c('Step in filter modal').t`Name`}
                </ButtonGroup>
                <ButtonGroup
                    disabled={!hasValidName}
                    onClick={() => onChange({ ...model, step: Step.CONDITIONS })}
                    className={model.step === Step.CONDITIONS ? 'is-active' : ''}
                >{c('Step in filter modal').t`Conditions`}</ButtonGroup>
                <ButtonGroup
                    disabled={!hasValidName || !model.conditions.length}
                    onClick={() => onChange({ ...model, step: Step.ACTIONS })}
                    className={model.step === Step.ACTIONS ? 'is-active' : ''}
                >{c('Step in filter modal').t`Actions`}</ButtonGroup>
                <ButtonGroup
                    disabled={!hasValidName || !model.actions.length || !model.conditions.length}
                    onClick={() => onChange({ ...model, step: Step.PREVIEW })}
                    className={model.step === Step.PREVIEW ? 'is-active' : ''}
                >{c('Step in filter modal').t`Preview`}</ButtonGroup>
            </Group>
        </header>
    );
};

export default HeaderFilterModal;
