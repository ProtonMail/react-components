import React, { useState } from 'react';
import { c } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import { ImportModalModel, ProviderFoldersMapItem, ImportPayloadModel, MailImportFolder } from '../interfaces';
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
        providerFolders.reduce((acc: { [key: string]: ProviderFoldersMapItem }, folder) => {
            acc[folder.Name] = {
                providerName: folder.Name,
                destinationName: folder.DestinationFolder || folder.Name,
                recommendedFolder: folder.DestinationFolder,
                descendants: getDescendants(folder.Name),
                checked: true,
            };
            return acc;
        }, {})
    );

    const getAncestorMapItems = (providerName: string) =>
        Object.values(providerFoldersMap).filter((f: ProviderFoldersMapItem) => f.descendants.includes(providerName));

    const handleToggleCheck = (providerName: string, checked: boolean) => {
        const newProviderFoldersMap = Object.values(providerFoldersMap).reduce(
            (acc: { [key: string]: ProviderFoldersMapItem }, folder) => {
                if (
                    folder.providerName === providerName ||
                    providerFoldersMap[providerName].descendants.includes(folder.providerName)
                ) {
                    acc[folder.providerName] = {
                        ...folder,
                        checked,
                    };

                    return acc;
                }

                acc[folder.providerName] = folder;

                return acc;
            },
            {}
        );

        setProviderFoldersMap(newProviderFoldersMap);
    };

    const handleRename = (providerName: string, destinationName: string) => {
        const newProviderFoldersMap = { ...providerFoldersMap };
        newProviderFoldersMap[providerName].destinationName = destinationName;
        setProviderFoldersMap(newProviderFoldersMap);
    };

    const renderRow = (item: ProviderFoldersMapItem) => {
        const ancestorsFolders = getAncestorMapItems(item.providerName);
        const disabled = ancestorsFolders.some((folder) => !folder.checked);

        return (
            <ImportManageFoldersRow
                {...item}
                key={item.providerName}
                onRename={handleRename}
                onToggleCheck={handleToggleCheck}
                disabled={disabled}
            />
        );
    };

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
