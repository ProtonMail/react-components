import React, { useState, useEffect } from 'react';

import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { Actions, SimpleFilterModalModel } from 'proton-shared/lib/filters/interfaces';

import FilterActionsFormLabelsRow from './FilterActionsFormLabelsRow';
import FilterActionsFormFoldersRow from './FilterActionsFormFolderRow';
import FilterActionsFormMarkAsRow from './FilterActionsFormMarkAsRow';
import FilterActionsFormAutoReplyRow from './FilterActionsFormAutoReplyRow';

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: SimpleFilterModalModel;
    onChange: (newModel: SimpleFilterModalModel) => void;
    isEdit: boolean;
}

const FilterActionsForm = ({ isNarrow, labels, folders, model, onChange, isEdit }: Props) => {
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
                isEdit={isEdit}
            />
        </>
    );
};

export default FilterActionsForm;
