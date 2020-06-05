import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Button, Select, Tooltip, classnames, Icon, useModals } from 'react-components';
import { buildTreeview, formatFolderName } from 'proton-shared/lib/helpers/folder';
import { Folder } from 'proton-shared/lib/interfaces/Folder';

import EditLabelModal from '../../labels/modals/Edit';

import { Actions } from './interfaces';

interface Props {
    folders: Folder[];
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

interface FolderWithSubFolders extends Folder {
    subfolders: FolderWithSubFolders[];
}

type ChangePayload = {
    folder?: string;
    isOpen: boolean;
};

type SelectOption = {
    value: string;
    text: string;
    group: string;
};

const formatOption = ({ Path, Name }: FolderWithSubFolders, level = 0) => ({
    value: Path || '',
    text: formatFolderName(level, Name, ' • '),
    group: c('Option group').t`Custom folders`
});

const reducer = (acc: SelectOption[] = [], folder: FolderWithSubFolders, level = 0) => {
    acc.push(formatOption(folder, level));

    if (Array.isArray(folder.subfolders)) {
        folder.subfolders.forEach((folder) => reducer(acc, folder, level + 1));
    }

    return acc;
};

const FilterActionsFormFolderRow = ({ folders, isNarrow, actions, handleUpdateActions }: Props) => {
    const { createModal } = useModals();
    const treeview = buildTreeview(folders);

    const options = [
        {
            group: c('Option group').t`Action`,
            text: c('Filter Actions').t`Move to ...`,
            value: ''
        },
        {
            group: c('Option group').t`Default folders`,
            text: c('Filter Actions').t`Archive`,
            value: 'archive'
        },
        {
            group: c('Option group').t`Default folders`,
            text: c('Filter Actions').t`Inbox`,
            value: 'inbox'
        },
        {
            group: c('Option group').t`Default folders`,
            text: c('Filter Actions').t`Spam`,
            value: 'spam'
        },
        {
            group: c('Option group').t`Default folders`,
            text: c('Filter Actions').t`Trash`,
            value: 'trash'
        }
    ].concat(treeview.reduce((acc: SelectOption[], folder: FolderWithSubFolders) => reducer(acc, folder), []));

    const { moveTo } = actions;
    const { isOpen } = moveTo;

    const handleChangeModel = (payload: Partial<ChangePayload>) => {
        handleUpdateActions({
            moveTo: {
                ...actions.moveTo,
                ...payload
            }
        });
    };

    const toggleSection = () => {
        handleChangeModel({ isOpen: !isOpen });
    };

    const handleClear = () => {
        handleChangeModel({
            folder: undefined
        });
    };

    const renderClosed = () => {
        if (!moveTo?.folder) {
            return <em className="ml0-5 pt0-5 color-global-altgrey">{c('Info').t`No folder selected`}</em>;
        }

        let selectedFolder;

        if (['archive', 'inbox', 'spam', 'trash'].includes(moveTo?.folder)) {
            selectedFolder = (
                <span className="inline-flex flex-items-center mr2">
                    <Icon name={moveTo?.folder} className="mr0-5" />
                    {options.find((o) => o.value === moveTo?.folder)?.text}
                </span>
            );
        } else {
            selectedFolder = moveTo?.folder.split('/').map((f: string, i: number) => (
                <React.Fragment key={f}>
                    {i !== 0 && (
                        <Icon
                            name="caret"
                            className="ml0-5"
                            style={{
                                transform: 'rotate(-90deg)'
                            }}
                        />
                    )}
                    <span className={classnames(['inline-flex flex-items-center', i !== 0 && 'ml0-5'])}>
                        <Icon name="folder" className="mr0-5" />
                        {f}
                    </span>
                </React.Fragment>
            ));
        }

        return <div className="ml0-5 pt0-5 flex flex-items-center">{selectedFolder}</div>;
    };

    return (
        <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <div
                className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                onClick={toggleSection}
                onKeyDown={(e) => e.key === 'Enter' && toggleSection()}
                role="button"
                tabIndex={0}
            >
                <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                <span className={classnames(['ml0-5', actions.error && 'color-global-warning'])}>{c('Label')
                    .t`Move to`}</span>
            </div>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                {isOpen ? (
                    <div className="w100">
                        <Select
                            id="memberSelect"
                            value={moveTo.folder || ''}
                            options={options}
                            onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) =>
                                handleChangeModel({ folder: value })
                            }
                        />
                        <Button className="mt1" onClick={() => createModal(<EditLabelModal type="folder" />)}>
                            {c('Action').t`Create new folder`}
                        </Button>
                    </div>
                ) : (
                    renderClosed()
                )}
            </div>
            <div>
                <Button
                    disabled={!moveTo?.folder}
                    onClick={handleClear}
                    className={classnames(['pm-button--for-icon', isNarrow ? 'mt1' : 'ml1'])}
                >
                    <Tooltip title={c('Action').t`Reset`} className="color-global-altgrey">
                        <Icon name="remove-text-formatting" />
                    </Tooltip>
                </Button>
            </div>
        </div>
    );
};

export default FilterActionsFormFolderRow;
