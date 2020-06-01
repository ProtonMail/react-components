import React, { useState, useEffect } from 'react';
import { c } from 'ttag';

import { classnames, Icon, Info, Toggle } from 'react-components';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { Action, FilterModalModel } from './interfaces';

// const conditionTemplate = {
//     type: ConditionType.SELECT,
//     comparator: ConditionComparator.CONTAINS
// };

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: FilterModalModel;
    onChange: (newModel: FilterModalModel) => void;
}

const FilterActionsForm = ({ isNarrow, /* labels, folders, */ model, onChange }: Props) => {
    const [actions /* setActions */] = useState<Action[]>(model.actions);

    // const onUpdateAction = (index: number, action: Action) => {
    //     setActions((actions: Action[]) => {
    //         actions[index] = action;
    //         return [...actions];
    //     });
    // };

    useEffect(() => {
        onChange({ ...model, actions });
    }, [actions]);

    const action = { error: false };

    return (
        <>
            <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div
                    className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                    // onClick={() => setIsOpen((isOpen) => !isOpen)}
                    // onKeyDown={(e) => e.key === 'Enter' && setIsOpen((isOpen) => !isOpen)}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" /* className={classnames([isOpen && 'rotateX-180'])} */ />
                    <span className={classnames(['ml0-5', action.error && 'color-global-warning'])}>
                        {c('Label').t`Label as`}
                    </span>
                </div>
                <div className="ml0-5 flex flex-column flex-item-fluid">render labels</div>
            </div>

            <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div
                    className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                    // onClick={() => setIsOpen((isOpen) => !isOpen)}
                    // onKeyDown={(e) => e.key === 'Enter' && setIsOpen((isOpen) => !isOpen)}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" /* className={classnames([isOpen && 'rotateX-180'])} */ />
                    <span className={classnames(['ml0-5', action.error && 'color-global-warning'])}>
                        {c('Label').t`Move to`}
                    </span>
                </div>
                <div className="ml0-5 flex flex-column flex-item-fluid">render folders</div>
            </div>

            <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div
                    className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                    // onClick={() => setIsOpen((isOpen) => !isOpen)}
                    // onKeyDown={(e) => e.key === 'Enter' && setIsOpen((isOpen) => !isOpen)}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" /* className={classnames([isOpen && 'rotateX-180'])} */ />
                    <span className={classnames(['ml0-5', action.error && 'color-global-warning'])}>
                        {c('Label').t`Mark as`}
                    </span>
                </div>
                <div className="ml0-5 flex flex-column flex-item-fluid">render mark as</div>
            </div>

            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                    <span className="ml0-5 mr0-5">{c('Label').t`Send auto-reply`}</span>
                </div>
                <div className="ml0-5 flex flex-column flex-item-fluid">
                    <Toggle />
                </div>
            </div>
            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                    <span className="ml0-5 mr0-5">{c('Label').t`Stop processing`}</span>
                    <Info url="https://protonmail.com/support/knowledge-base/images-by-default/" />
                </div>
                <div className="ml0-5 flex flex-column flex-item-fluid">
                    <Toggle />
                </div>
            </div>
        </>
    );
};

export default FilterActionsForm;
