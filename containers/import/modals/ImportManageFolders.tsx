import React, { useState, useMemo, useEffect } from 'react';
import { c } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import {
    ImportModalModel,
    ImportPayloadModel,
    FolderMapping,
    MailImportFolder,
    CheckedFoldersMap,
    DisabledFoldersMap,
    ChildrenRelationshipMap,
} from '../interfaces';
import { PATH_SPLIT_REGEX } from '../constants';

import ImportManageFoldersRow from './ImportManageFoldersRow';

interface Props {
    modalModel: ImportModalModel;
    address: Address;
    payload: ImportPayloadModel;
    onChangePayload: (newPayload: ImportPayloadModel) => void;
}

const getLevel = (name: string, separator: string) => {
    return name.split(separator === '/' ? PATH_SPLIT_REGEX : separator).length - 1;
};

const ImportManageFolders = ({ modalModel, address, payload, onChangePayload }: Props) => {
    const { providerFolders } = modalModel;

    const childrenRelationshipMap = providerFolders.reduce((acc: ChildrenRelationshipMap, folder) => {
        const currentLevel = getLevel(folder.Source, folder.Separator);

        acc[folder.Source] = providerFolders
            .filter((f) => {
                const level = getLevel(f.Source, f.Separator);
                return currentLevel + 1 === level && f.Source.startsWith(folder.Source);
            })
            .map((f) => f.Source);

        return acc;
    }, {});

    const [checkedFoldersMap, setCheckedFoldersMap] = useState(
        providerFolders.reduce<CheckedFoldersMap>((acc, folder) => {
            const found = payload.Mapping.find((m) => m.Source === folder.Source);
            acc[folder.Source] = !!found;
            return acc;
        }, {})
    );

    const [foldersNameMap, setFoldersNameMap] = useState(
        providerFolders.reduce<{ [key: string]: string }>((acc, folder) => {
            const found = payload.Mapping.find((m) => m.Source === folder.Source);
            acc[folder.Source] = found?.Destinations.FolderName || folder.DestinationFolder || folder.Source;
            return acc;
        }, {})
    );

    const getParent = (folderName: string) => {
        const [parentName] =
            Object.entries(childrenRelationshipMap).find(([_, children]) => {
                return children.includes(folderName);
            }) || [];
        return parentName;
    };

    const disabledFoldersMap = useMemo(() => {
        return providerFolders.reduce<DisabledFoldersMap>((acc, folder) => {
            const parentName = getParent(folder.Source);
            acc[folder.Source] = parentName ? acc[parentName] || !checkedFoldersMap[parentName] : false;
            return acc;
        }, {});
    }, [checkedFoldersMap]);

    const getDescendants = (children: string[], maxLevel?: number, separatorSymbol?: string | RegExp) => {
        const separator = separatorSymbol === '/' ? PATH_SPLIT_REGEX : separatorSymbol;

        const grandChildren: string[] = children.reduce<string[]>((acc, childName) => {
            const children = childrenRelationshipMap[childName];

            return [...acc, ...getDescendants(children, maxLevel, separator)];
        }, []);

        return [...children, ...grandChildren];
    };

    const handleToggleCheck = (providerName: string, checked: boolean) => {
        const newCheckedFoldersMap = {
            ...checkedFoldersMap,
            [providerName]: checked,
        };

        const children = childrenRelationshipMap[providerName];
        const descendants = children ? getDescendants(children) : [];

        descendants.forEach((folderName) => (newCheckedFoldersMap[folderName] = checked));

        setCheckedFoldersMap(newCheckedFoldersMap);
    };

    const handleRename = (providerName: string, newPath: string, previousPath: string) => {
        const newFoldersNameMap = { ...foldersNameMap };

        newFoldersNameMap[providerName] = newPath;

        const found = providerFolders.find((f) => f.Source === providerName);
        const level = found ? getLevel(found.Source, found.Separator) : undefined;

        if (typeof level !== 'undefined' && level <= 1) {
            const children = childrenRelationshipMap[providerName];
            const descendants = children ? getDescendants(children) : [];

            descendants.forEach((folderName) => {
                newFoldersNameMap[folderName] = newFoldersNameMap[folderName].replace(previousPath, newPath);
            });
        }

        setFoldersNameMap(newFoldersNameMap);
    };

    useEffect(() => {
        const Mapping = providerFolders.reduce<FolderMapping[]>((acc, folder) => {
            if (checkedFoldersMap[folder.Source]) {
                acc.push({
                    Source: folder.Source,
                    Destinations: {
                        FolderName: foldersNameMap[folder.Source],
                    },
                    checked: true,
                });
            }

            return acc;
        }, []);

        onChangePayload({
            ...payload,
            Mapping,
        });
    }, [checkedFoldersMap, foldersNameMap]);

    return (
        <>
            <div className="mt1 mb1">{c('Info').t`Please select the source folders of you want to import:`}</div>

            <div className="flex">
                <div className="w40 ellipsis pt1">
                    <strong>{c('Label').t`From: ${modalModel.email}`}</strong>
                </div>

                <div className="w40 ellipsis pt1">
                    <strong>{c('Label').t`To: ${address.Email}`}</strong>
                </div>

                <div className="w20 pt1">
                    <strong>{c('Label').t`Actions`}</strong>
                </div>
            </div>

            <div className="flex mb1">
                <div className="flex-item-fluid pt0-5">
                    <ul className="unstyled m0">
                        {providerFolders
                            .filter((folder) => getLevel(folder.Source, folder.Separator) === 0)
                            .map((item: MailImportFolder) => (
                                <ImportManageFoldersRow
                                    onToggleCheck={handleToggleCheck}
                                    key={item.Source}
                                    folder={item}
                                    level={0}
                                    disabledFoldersMap={disabledFoldersMap}
                                    checkedFoldersMap={checkedFoldersMap}
                                    childrenRelationshipMap={childrenRelationshipMap}
                                    providerFolders={providerFolders}
                                    foldersNameMap={foldersNameMap}
                                    onRename={handleRename}
                                />
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ImportManageFolders;
