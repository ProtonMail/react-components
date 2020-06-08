import React, { useMemo } from 'react';
import { c, jt, t } from 'ttag';

import { classnames, Icon } from 'react-components';

import { getI18n as getI18nFilter } from 'proton-shared/lib/filters/factory';

import { FilterModalModel, ConditionType } from './interfaces';

interface Props {
    isNarrow: boolean;
    model: FilterModalModel;
    toggleOpen: () => void;
    isOpen: boolean;
}

const FilterPreviewConditions = ({ isOpen, isNarrow, toggleOpen, model }: Props) => {
    const { conditions } = model;

    const { TYPES, COMPARATORS } = getI18nFilter();

    const conditionsRenderer = useMemo(() => {
        const conditionsRows = conditions?.map((cond) => {
            if (cond.type === ConditionType.ATTACHMENTS) {
                const label = cond.withAttachment ? t`with attachments` : t`without attachments`;
                const attachment = isOpen ? (
                    <span className="inline-flex flex-row flex-items-center condition-token mb0-5" role="listitem">
                        <span className="ellipsis nodecoration">{label}</span>
                    </span>
                ) : (
                    <strong>{label}</strong>
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
                <div
                    className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                    onClick={toggleOpen}
                    onKeyDown={(e) => e.key === 'Enter' && toggleOpen()}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                    <span className="ml0-5">{c('Label').t`Conditions`}</span>
                </div>
                <div className="flex flex-column flex-item-fluid">
                    <div className={classnames(['pl0-5 pt0-5', !isOpen && 'mw100 ellipsis'])}>{conditionsRenderer}</div>
                </div>
            </div>
        </div>
    );
};

export default FilterPreviewConditions;
