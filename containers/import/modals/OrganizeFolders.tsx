import React from 'react';
import { Icon, Button, Select, Checkbox, DropdownActions, useFolders } from '../../..';
import { c } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { buildTreeview, formatFolderName } from 'proton-shared/lib/helpers/folder';
import { Address } from 'proton-shared/lib/interfaces';

import { ImportModalModel, DestinationFolder } from '../interfaces';
import { FolderWithSubFolders } from 'proton-shared/lib/interfaces/Folder';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    address: Address;
}

interface FolderSelectOption {
    value: DestinationFolder | string;
    text: string;
    group?: string;
}

const FOLDER_GROUP = {
    DEFAULT: c('Option group').t`Default folders`,
    CUSTOM: c('Option group').t`Custom folders`,
    PROVIDER: c('Option group').t`Provider folders`,
};

const FOLDER_ICONS = {
    [DestinationFolder.INBOX]: 'inbox',
    [DestinationFolder.ALL_DRAFTS]: 'drafts',
    [DestinationFolder.ALL_SENT]: 'sent',
    [DestinationFolder.TRASH]: 'trash',
    [DestinationFolder.SPAM]: 'spam',
    [DestinationFolder.ARCHIVE]: 'archive',
    [DestinationFolder.SENT]: 'sent',
    [DestinationFolder.DRAFTS]: 'drafts',
    [DestinationFolder.STARRED]: 'star',
    [DestinationFolder.ALL_MAIL]: 'all-emails',
};

const defaultFolders: FolderSelectOption[] = [
    {
        text: c('Import Destination').t`Do not import`,
        value: '',
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: c('Import Destination').t`Inbox`,
        value: DestinationFolder.INBOX,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.ARCHIVE,
        value: DestinationFolder.ARCHIVE,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.SENT,
        value: DestinationFolder.SENT,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: c('Import Destination').t`Starred`,
        value: DestinationFolder.STARRED,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.DRAFTS,
        value: DestinationFolder.DRAFTS,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.SPAM,
        value: DestinationFolder.SPAM,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.TRASH,
        value: DestinationFolder.TRASH,
    },
    {
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.ALL_MAIL,
        value: DestinationFolder.ALL_MAIL,
    },
];

const formatOption = ({ Path, Name }: FolderWithSubFolders, level = 0) => ({
    value: Path || '',
    text: formatFolderName(level, Name, ' • '),
    group: FOLDER_GROUP.CUSTOM,
});

const folderReducer = (
    acc: FolderSelectOption[] = [],
    folder: FolderWithSubFolders,
    level = 0
): FolderSelectOption[] => {
    acc.push(formatOption(folder, level));

    if (Array.isArray(folder.subfolders)) {
        folder.subfolders.forEach((folder) => folderReducer(acc, folder, level + 1));
    }

    return acc;
};

const OrganizeFolders = ({ model, setModel, address }: Props) => {
    const [folders = []] = useFolders();
    const treeview = buildTreeview(folders);
    const reducedFolders = treeview.reduce<FolderSelectOption[]>((acc, folder) => {
        return folderReducer(acc, folder, 0);
    }, []);

    /* @todo treeview of providerFolders */
    const tempFolders = model.providerFolders
        .filter((f) => !f.DestinationFolder)
        .map((f) => {
            const split = f.Name.split('/');
            const level = split.length - 1;
            const maxLevel = Math.min(level, 2);
            const formatted = formatFolderName(maxLevel, split.slice(maxLevel).join('/'), ' • ');

            return {
                value: f.Name,
                text: formatted,
                group: FOLDER_GROUP.PROVIDER,
            };
        });

    const foldersOptions = [...defaultFolders, ...reducedFolders, ...tempFolders];

    const dropdownActions = [
        {
            text: c('Action').t`Edit`,
            onClick: noop,
        },
        {
            text: c('Action').t`Add folder`,
            onClick: noop,
        },
    ];

    return (
        <>
            <div className="flex">
                <div className="flex-item-fluid ellipsis bg-global-light pt1 pl1 pr1">
                    <span>{c('Label').t`From`}</span>
                    {`: `}
                    <strong>{model.email}</strong>
                </div>
                <div className="flex-item-fluid ellipsis pt1 pl1 pr1">
                    <span>{c('Label').t`To`}</span>
                    {`: `}
                    <strong>{address.Email}</strong>
                </div>
            </div>

            <div className="flex mb1">
                <div className="flex-item-fluid bg-global-light pt0-5">
                    <ul className="unstyled m0">
                        {model.providerFolders.map(({ Name, DestinationFolder }, index) => {
                            const split = Name.split('/');
                            const level = split.length - 1;
                            const displayName = split[level];

                            return (
                                <li
                                    key={`providerFolder_${index}`}
                                    className="flex flex-nowrap flex-items-center border-bottom pl1 pr1"
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <span
                                        className="flex-item-noshrink"
                                        style={{
                                            marginLeft: `${level}em`,
                                        }}
                                    >
                                        <Checkbox id={`providerFolder_${index}`} />
                                    </span>
                                    <label
                                        htmlFor={`providerFolder_${index}`}
                                        title={displayName}
                                        className="flex-item-fluid-auto ellipsis"
                                    >
                                        <Icon
                                            name={DestinationFolder ? FOLDER_ICONS[DestinationFolder] : 'folder'}
                                            className="mr0-5 ml0-5 flex-item-noshrink"
                                        />
                                        {displayName}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex-item-fluid pt0-5">
                    <ul className="unstyled m0">
                        {model.providerFolders
                            .filter(({ DestinationFolder }) => typeof DestinationFolder !== 'undefined')
                            .map(({ DestinationFolder }) => {
                                return (
                                    <li
                                        key={DestinationFolder}
                                        className="flex flex-nowrap flex-items-center pl1 pr1"
                                        style={{
                                            height: 50,
                                        }}
                                    >
                                        <Select
                                            className="flex-item-fluid"
                                            options={foldersOptions}
                                            defaultValue={DestinationFolder}
                                        />
                                        <Button className="flex-item-noshrink ml1">{c('Action').t`Add folder`}</Button>
                                    </li>
                                );
                            })}
                        {model.providerFolders
                            .filter(({ DestinationFolder }) => typeof DestinationFolder === 'undefined')
                            .map(({ Name }, index) => {
                                return (
                                    <li
                                        className="flex flex-nowrap flex-items-center pl1 pr1"
                                        style={{
                                            height: 50,
                                        }}
                                        key={index}
                                    >
                                        <Select
                                            className="flex-item-fluid"
                                            options={foldersOptions}
                                            defaultValue={Name}
                                        />
                                        <div className="ml1">
                                            <DropdownActions key="dropdown" list={dropdownActions} />
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default OrganizeFolders;
