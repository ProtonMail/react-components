import React from 'react';
import { c } from 'ttag';

import { classnames, Toggle, Info } from 'react-components';

import { Actions } from './interfaces';

interface Props {
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormProcessingRow = ({ isNarrow, actions, handleUpdateActions }: Props) => {
    const { stopProcessing } = actions;

    return (
        <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <label htmlFor="stopProcessing" className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                <span className="ml0-5 mr0-5">{c('Label').t`Stop processing`}</span>
                <Info url="https://protonmail.com/support/knowledge-base/images-by-default/" />
            </label>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                <Toggle
                    id="stopProcessing"
                    checked={stopProcessing}
                    onChange={() => handleUpdateActions({ stopProcessing: !stopProcessing })}
                />
            </div>
        </div>
    );
};

export default FilterActionsFormProcessingRow;
