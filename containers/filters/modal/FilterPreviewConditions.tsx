import React, { useMemo } from 'react';
import { c, jt, t } from 'ttag';

import { classnames, Icon } from 'react-components';

import { TYPES, COMPARATORS } from 'proton-shared/lib/filters/constants';
import { SimpleFilterModalModel, ConditionType, ConditionComparator } from 'proton-shared/lib/filters/interfaces';

interface Props {
    isNarrow: boolean;
    model: SimpleFilterModalModel;
    toggleOpen: () => void;
    isOpen: boolean;
}

const FilterPreviewConditions = ({ isOpen, isNarrow, toggleOpen, model }: Props) => {
    const { conditions } = model;

    const conditionsRenderer = useMemo(() => {
        const conditionsRows = conditions?.map((cond) => {
            if (cond.type === ConditionType.ATTACHMENTS) {
                const label =
                    cond.comparator === ConditionComparator.CONTAINS ? t`with attachments` : t`without attachments`;
                const attachment = isOpen ? (
                    <span
                        key={label}
                        className="inline-flex flex-row flex-items-center condition-token mb0-5"
                        role="listitem"
                    >
                        <span className="ellipsis nodecoration">{label}</span>
                    </span>
                ) : (
                    <strong key={label}>{label}</strong>
                );
                return c('Label').jt`the email was sent ${attachment}`;
            }

            const typeLabel = TYPES.find((t) => t.value === cond.type)?.label;
            const comparatorLabel = COMPARATORS.find((t) => t.value === cond.comparator)?.label;

            const values = cond?.values?.map((v, i) => {
                const value = isOpen ? (
                    <span
                        key={`${v}${i}`}
                        className="inline-flex flex-row flex-items-center condition-token mb0-5"
                        role="listitem"
                    >
                        <span className="ellipsis nodecoration">{v}</span>
                    </span>
                ) : (
                    <strong key={`${v}${i}`}>{v}</strong>
                );
                return i > 0 ? jt` or ${value}` : value;
            });
            return c('Label ').jt`${typeLabel?.toLowerCase()} ${comparatorLabel} ${values}`;
        });

        return conditionsRows.map((cond, i) =>
            isOpen ? (
                <div key={`preview-condition-${i}`}>
                    {i === 0 ? c('Label').t`If` : c('Label').t`And`}

                    {` `}
                    {cond}
                </div>
            ) : (
                <span key={`preview-condition-${i}`}>
                    {i === 0 ? c('Label').t`If` : ` ${c('Label').t`and`}`}
                    {` `}
                    {cond}
                </span>
            )
        );
    }, [isOpen]);

    return (
        <div className="border-bottom">
            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <button type="button" className={classnames(['w25 alignleft', isNarrow && 'mb1'])} onClick={toggleOpen}>
                    <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                    <span className="ml0-5">{c('Label').t`Conditions`}</span>
                </button>
                <div className="ml1 flex flex-column flex-item-fluid">
                    <div className={classnames(['pt0-5', !isOpen && 'mw100 ellipsis'])}>{conditionsRenderer}</div>
                </div>
            </div>
        </div>
    );
};

export default FilterPreviewConditions;
