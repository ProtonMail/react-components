import React, { useState, useEffect } from 'react';

import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { Actions, FilterModalModel } from './interfaces';

import FilterActionsFormLabelsRow from './FilterActionsFormLabelsRow';
import FilterActionsFormFoldersRow from './FilterActionsFormFolderRow';
import FilterActionsFormMarkAsRow from './FilterActionsFormMarkAsRow';
import FilterActionsFormAutoReplyRow from './FilterActionsFormAutoReplyRow';
import FilterActionsFormProcessingRow from './FilterActionsFormProcessingRow';

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: FilterModalModel;
    onChange: (newModel: FilterModalModel) => void;
}

const FilterActionsForm = ({ isNarrow, labels, folders, model, onChange }: Props) => {
    const [actions, setActions] = useState<Actions>(model.actions);

    const onUpdateActions = (payload: Partial<Actions>) => {
        setActions((actions: Actions) => ({
            ...actions,
            ...payload
        }));
    };

    useEffect(() => {
        onChange({ ...model, actions });
    }, [actions]);

    return (
        <>
            <FilterActionsFormLabelsRow
                actions={actions}
                handleUpdateActions={onUpdateActions}
                labels={labels}
                isNarrow={isNarrow}
            />
            <FilterActionsFormFoldersRow
                actions={actions}
                handleUpdateActions={onUpdateActions}
                folders={folders}
                isNarrow={isNarrow}
            />
            <FilterActionsFormMarkAsRow actions={actions} handleUpdateActions={onUpdateActions} isNarrow={isNarrow} />

            <FilterActionsFormAutoReplyRow
                actions={actions}
                handleUpdateActions={onUpdateActions}
                isNarrow={isNarrow}
            />

            <FilterActionsFormProcessingRow
                actions={actions}
                handleUpdateActions={onUpdateActions}
                isNarrow={isNarrow}
            />
        </>
    );
};

export default FilterActionsForm;
