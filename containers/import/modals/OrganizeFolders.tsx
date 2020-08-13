import React, { ChangeEvent } from 'react';
import { Icon, Button, Select, Checkbox, DropdownActions, useFolders } from '../../..';
import { c } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { buildTreeview, formatFolderName } from 'proton-shared/lib/helpers/folder';
import { Address } from 'proton-shared/lib/interfaces';

import { ImportModalModel, DestinationFolder, ImportModel, FolderMapping } from '../interfaces';
import { FolderWithSubFolders } from 'proton-shared/lib/interfaces/Folder';
import Loader from '../../../components/loader/Loader';
import { classnames } from '../../../helpers/component';

interface Props {
    modalModel: ImportModalModel;
    address: Address;
    importModel: ImportModel;
    setImportModel: React.Dispatch<React.SetStateAction<ImportModel>>;
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
        group: FOLDER_GROUP.DEFAULT,
        text: DestinationFolder.INBOX, // c('Import Destination').t`Inbox`,
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
        text: DestinationFolder.STARRED, // c('Import Destination').t`Starred`,
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

const OrganizeFolders = ({ modalModel, importModel, setImportModel, address }: Props) => {
    const { providerFolders } = modalModel;
    const [folders = [], foldersLoading] = useFolders();
    const treeview = buildTreeview(folders);
    const customFolders = treeview.reduce<FolderSelectOption[]>((acc, folder) => {
        return folderReducer(acc, folder, 0);
    }, []);

    /* @todo put this in its own state */
    const tempFolders = providerFolders
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

    const foldersOptions = [
        { text: c('Import Destination').t`Do not import`, value: '' },
        ...defaultFolders,
        ...customFolders,
        ...tempFolders,
    ];

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

    const onToggleCheck = (index: number, checked: boolean) => {
        const oldMapping = importModel.Mapping;
        const folderFromProvider = providerFolders[index];

        const Mapping: FolderMapping[] = [
            ...oldMapping.slice(0, index),
            {
                Source: oldMapping[index].Source,
                Destinations: {
                    FolderName: checked ? folderFromProvider.DestinationFolder || folderFromProvider.Name : '',
                },
            },
            ...oldMapping.slice(index + 1),
        ];

        setImportModel({ ...importModel, Mapping });
    };

    const onChangeSelect = (index: number, value: string) => {
        const oldMapping = importModel.Mapping;
        const Mapping: FolderMapping[] = [
            ...oldMapping.slice(0, index),
            {
                Source: oldMapping[index].Source,
                Destinations: {
                    FolderName: value,
                },
            },
            ...oldMapping.slice(index + 1),
        ];

        setImportModel({ ...importModel, Mapping });
    };

    return foldersLoading ? (
        <Loader />
    ) : (
        <>
            <div className="flex">
                <div className="flex-item-fluid ellipsis bg-global-light pt1 pl1 pr1">
                    <span>{c('Label').t`From`}</span>
                    {`: `}
                    <strong>{modalModel.email}</strong>
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
                        {providerFolders.map(({ Name, DestinationFolder }, index) => {
                            const split = Name.split('/');
                            const level = split.length - 1;
                            const displayName = split[level];

                            return (
                                <li
                                    key={`providerFolder_${index}`}
                                    className={classnames([
                                        'flex flex-nowrap flex-items-center border-bottom pl1 pr1',
                                        !importModel.Mapping[index].Destinations.FolderName && 'opacity-50',
                                    ])}
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <span
                                        className="flex-item-noshrink"
                                        style={
                                            DestinationFolder
                                                ? undefined
                                                : {
                                                      marginLeft: `${level}em`,
                                                  }
                                        }
                                    >
                                        <Checkbox
                                            onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                                                onToggleCheck(index, target.checked);
                                            }}
                                            id={`providerFolder_${index}`}
                                            checked={importModel.Mapping[index].Destinations.FolderName !== ''}
                                        />
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
                        {providerFolders.map(({ Name, DestinationFolder }, index) => (
                            <li
                                className={classnames([
                                    'flex flex-nowrap flex-items-center pl1 pr1',
                                    !importModel.Mapping[index].Destinations.FolderName && 'opacity-50',
                                ])}
                                style={{
                                    height: 50,
                                }}
                                key={Name}
                            >
                                {DestinationFolder ? (
                                    <>
                                        <Select
                                            className="flex-item-fluid"
                                            options={foldersOptions}
                                            value={importModel.Mapping[index].Destinations.FolderName}
                                            onChange={({ target }: ChangeEvent<HTMLSelectElement>) => {
                                                onChangeSelect(index, target.value);
                                            }}
                                        />
                                        <Button className="flex-item-noshrink ml1">{c('Action').t`Add folder`}</Button>
                                    </>
                                ) : (
                                    <>
                                        <Select
                                            className="flex-item-fluid"
                                            options={foldersOptions}
                                            value={importModel.Mapping[index].Destinations.FolderName}
                                            onChange={({ target }: ChangeEvent<HTMLSelectElement>) => {
                                                onChangeSelect(index, target.value);
                                            }}
                                        />
                                        <div className="ml1">
                                            <DropdownActions key="dropdown" list={dropdownActions} />
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default OrganizeFolders;
