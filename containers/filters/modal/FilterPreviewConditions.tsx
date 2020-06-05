import React from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';

// import { getI18n as getI18nFilter } from 'proton-shared/lib/filters/factory';

import { FilterModalModel } from './interfaces';

interface Props {
    isNarrow: boolean;
    model: FilterModalModel;
    toggleOpen: () => void;
    isOpen: boolean;
}

const FilterPreviewConditions = ({ isOpen, isNarrow, toggleOpen /* model */ }: Props) => {
    // const { conditions } = model;

    // const { TYPES, COMPARATORS } = getI18nFilter();

    const renderConditions = () => {
        //     const typeLabel = TYPES.find((t) => t.value === type)?.label;
        //     const comparatorLabel = COMPARATORS.find((t) => t.value === comparator)?.label;
        //     const values = condition?.values?.map((v, i) => {
        //         const value = <strong key={`${v}${i}`}>{v}</strong>;
        //         return i > 0 ? jt` or ${value}` : value;
        //     });
        //     label = c('Label').jt`${typeLabel} ${comparatorLabel} ${values}`;

        // return <span className="mw100 ml0-5 pt0-5 ellipsis">{label}</span>;

        return <div className="pl0-5 pt0-5">{isOpen ? <span>Open</span> : <span>Closed</span>}</div>;
    };

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
                <div className="flex flex-column flex-item-fluid">{renderConditions()}</div>
            </div>
        </div>
    );
};

export default FilterPreviewConditions;
