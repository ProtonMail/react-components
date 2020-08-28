import React, { useState, useEffect } from 'react';
import { c } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import {
    ImportModalModel,
    ProviderFoldersMapItem,
    ProviderFolderMap,
    ImportPayloadModel,
    MailImportFolder,
    FolderMapping,
} from '../interfaces';
import ImportManageFoldersRow from './ImportManageFoldersRow';

interface Props {
    modalModel: ImportModalModel;
    address: Address;
    payload: ImportPayloadModel;
    onChangePayload: (newPayload: ImportPayloadModel) => void;
}

const ImportManageFolders = ({ modalModel, address, payload, onChangePayload }: Props) => {
    const { providerFolders } = modalModel;

    const getDescendants = (providerName: string): string[] =>
        providerFolders.reduce((acc: string[], folder: MailImportFolder) => {
            if (folder.Name !== providerName && folder.Name.startsWith(providerName)) {
                return [...acc, folder.Name];
            }

            return acc;
        }, []);

    const [providerFoldersMap, setProviderFoldersMap] = useState(
        providerFolders.reduce((acc: ProviderFolderMap, folder) => {
            const found = payload.Mapping.find((m) => m.Source === folder.Name);

            acc[folder.Name] = {
                providerPath: folder.Name,
                destinationPath: found?.Destinations.FolderName || folder.DestinationFolder || folder.Name,
                recommendedFolder: folder.DestinationFolder,
                descendants: getDescendants(folder.Name),
                checked: !!found && found.checked,
            };
            return acc;
        }, {})
    );

    const getAncestorMapItems = (providerName: string) =>
        Object.values(providerFoldersMap).filter((f: ProviderFoldersMapItem) => f.descendants.includes(providerName));

    const handleToggleCheck = (providerName: string, checked: boolean) => {
        const newProviderFoldersMap = Object.values(providerFoldersMap).reduce((acc: ProviderFolderMap, folder) => {
            if (
                folder.providerPath === providerName ||
                providerFoldersMap[providerName].descendants.includes(folder.providerPath)
            ) {
                acc[folder.providerPath] = {
                    ...folder,
                    checked,
                };

                return acc;
            }

            acc[folder.providerPath] = folder;

            return acc;
        }, {});

        setProviderFoldersMap(newProviderFoldersMap);
    };

    const handleRename = (providerName: string, newPath: string) => {
        const newProviderFoldersMap = { ...providerFoldersMap };
        const newLevel = newPath.split('/').length - 1;
        const oldPath = providerFoldersMap[providerName].destinationPath;

        if (newLevel < 2) {
            newProviderFoldersMap[providerName].descendants.forEach((name: string) => {
                newProviderFoldersMap[name].destinationPath = newProviderFoldersMap[name].destinationPath.replace(
                    oldPath,
                    newPath
                );
            });
        }

        newProviderFoldersMap[providerName].destinationPath = newPath;

        setProviderFoldersMap(newProviderFoldersMap);
    };

    const renderRow = (item: ProviderFoldersMapItem) => {
        const ancestorsFolders = getAncestorMapItems(item.providerPath);
        const disabled = ancestorsFolders.some((folder) => !folder.checked);

        return (
            <ImportManageFoldersRow
                {...item}
                providerFoldersMap={providerFoldersMap}
                key={item.providerPath}
                onRename={handleRename}
                onToggleCheck={handleToggleCheck}
                disabled={disabled}
            />
        );
    };

    useEffect(() => {
        const Mapping = Object.values(providerFoldersMap).reduce(
            (acc: FolderMapping[], { providerPath, checked, destinationPath }: ProviderFoldersMapItem) => {
                return [
                    ...acc,
                    {
                        Source: providerPath,
                        Destinations: {
                            FolderName: destinationPath,
                        },
                        checked,
                    },
                ];
            },
            []
        );

        onChangePayload({
            ...payload,
            Mapping,
        });
    }, [providerFoldersMap]);

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
                    <ul className="unstyled m0">{Object.values(providerFoldersMap).map(renderRow)}</ul>
                </div>
            </div>
        </>
    );
};

export default ImportManageFolders;
