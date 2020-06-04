import React from 'react';
import { c } from 'ttag';

import { classnames, Toggle } from 'react-components';

import { Actions } from './interfaces';

interface Props {
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormAutoReplyRow = ({ isNarrow, actions, handleUpdateActions }: Props) => {
    const { autoReply } = actions;

    return (
        <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <label htmlFor="autoReply" className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                <span className="ml0-5 mr0-5">{c('Label').t`Send auto-reply`}</span>
            </label>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                <Toggle
                    id="autoReply"
                    checked={autoReply}
                    onChange={() => {
                        handleUpdateActions({ autoReply: !autoReply });
                    }}
                />
                {autoReply && (
                    <div
                        className="mt1 w100"
                        style={{
                            height: 300,
                            background: 'pink',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Coucou le Squire Editor
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterActionsFormAutoReplyRow;
