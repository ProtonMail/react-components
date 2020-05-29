import React, { useState } from 'react';
import { c } from 'ttag';

import { Radio, LinkButton, useActiveBreakpoint } from 'react-components';

import { Condition, FilterStatement, FilterType, Comparator } from './interfaces';
import FilterConditionsFormRow from './FilterConditionsFormRow';
import { classnames } from '../../../helpers/component';

const initialCondition = {
    type: FilterType.SELECT,
    comparator: Comparator.CONTAINS
};

const FilterConditionsForm = () => {
    const { isNarrow } = useActiveBreakpoint();
    const [statement, setStatement] = useState<FilterStatement>(FilterStatement.ALL);
    const [conditions, setConditions] = useState<Condition[]>([{ ...initialCondition }]);

    const onAddCondtion = () => {
        setConditions((conditions: Condition[]) => {
            return [...conditions, { ...initialCondition }];
        });
    };

    const onDeleteCondition = (i: number) => {
        setConditions((conditions: Condition[]) => {
            conditions.splice(i, 1);
            return [...conditions];
        });
    };

    const onChangeType = (index: number, type: FilterType) => {
        setConditions((conditions: Condition[]) => {
            conditions[index].type = type;
            return [...conditions];
        });
    };

    const onChangeComparator = (index: number, comparator: Comparator) => {
        setConditions((conditions: Condition[]) => {
            conditions[index].comparator = comparator;
            return [...conditions];
        });
    };

    return (
        <>
            <div className="flex flex-nowrap mb0 onmobile-flex-column border-bottom">
                <div className={classnames(['w20', isNarrow && 'mb1'])}>{c('Label').t`Statement`}</div>
                <div className={classnames([!isNarrow && 'ml1'])}>
                    <Radio
                        id="statement-all"
                        className="flex flex-nowrap mb1 pm-radio--onTop"
                        checked={statement === FilterStatement.ALL}
                        onChange={() => setStatement(FilterStatement.ALL)}
                    >
                        {c('Label').t`ALL`}
                        <em className="ml0-5 color-global-altgrey">{c('Info')
                            .t`(Filter if ALL of the following conditions are met)`}</em>
                    </Radio>
                    <Radio
                        id="statement-any"
                        className="flex flex-nowrap mb1 pm-radio--onTop"
                        checked={statement === FilterStatement.ANY}
                        onChange={() => setStatement(FilterStatement.ANY)}
                    >
                        {c('Label').t`ANY`}
                        <em className="ml0-5 color-global-altgrey">{c('Info')
                            .t`(Filter if ANY of the following conditions are met)`}</em>
                    </Radio>
                </div>
            </div>
            {conditions.map((condition, i) => (
                <FilterConditionsFormRow
                    key={`Condition_${i}`}
                    condition={condition}
                    conditionIndex={i}
                    handleDelete={onDeleteCondition}
                    handleChangeType={onChangeType}
                    handleChangeComparator={onChangeComparator}
                    statement={statement}
                    displayDelete={conditions.length > 1}
                />
            ))}
            <LinkButton onClick={onAddCondtion} className="mt1 mb0-5">
                <strong>{c('Action').t`Add condition`}</strong>
            </LinkButton>
        </>
    );
};

export default FilterConditionsForm;
