import React from 'react';
import { Icon, Button, Select, Checkbox, DropdownActions } from '../../..';
import { c } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { Address } from 'proton-shared/lib/interfaces';
import { ImportModalModel, DestinationLabelID } from '../interfaces';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    address: Address;
}

interface FolderSelectOption {
    value: DestinationLabelID | string;
    text: string;
    group?: string;
    disabled?: boolean;
}

const FOLDER_GROUP = {
    DEFAULT: c('Option group').t`Default folders`,
    CUSTOM: c('Option group').t`Custom folders`,
    PROVIDER: c('Option group').t`Default folders`,
};

const FOLDER_ICONS = {
    [DestinationLabelID.INBOX]: 'inbox',
    [DestinationLabelID.ALL_DRAFTS]: 'drafts',
    [DestinationLabelID.ALL_SENT]: 'sent',
    [DestinationLabelID.TRASH]: 'trash',
    [DestinationLabelID.SPAM]: 'spam',
    [DestinationLabelID.ARCHIVE]: 'archive',
    [DestinationLabelID.SENT]: 'sent',
    [DestinationLabelID.DRAFTS]: 'drafts',
    [DestinationLabelID.STARRED]: 'star',
    [DestinationLabelID.ALL_MAIL]: 'all-emails',
};

const OrganizeFolders = ({ model, setModel, address }: Props) => {
    const foldersOptions: FolderSelectOption[] = [
        {
            text: c('Import Destination').t`Do not import`,
            value: '',
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Inbox`,
            value: DestinationLabelID.INBOX,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Archive`,
            value: DestinationLabelID.ARCHIVE,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Sent`,
            value: DestinationLabelID.SENT,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Draft`,
            value: DestinationLabelID.DRAFTS,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Spam`,
            value: DestinationLabelID.SPAM,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`Trash`,
            value: DestinationLabelID.TRASH,
        },
        {
            group: FOLDER_GROUP.DEFAULT,
            text: c('Import Destination').t`All mails`,
            value: DestinationLabelID.ALL_MAIL,
        },
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

    return (
        <>
            <div className="flex">
                <div className="flex-item-fluid ellipsis bg-global-muted pt1 pl1 pr1">
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
                <div className="flex-item-fluid bg-global-muted pt0-5">
                    <ul className="unstyled m0">
                        {model.oldFolders.map(({ Name, DestinationLabelID }, index) => {
                            return (
                                <li
                                    key={`oldFolder_${index}`}
                                    className="flex flex-nowrap flex-items-center border-bottom pl1 pr1"
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Checkbox id={`oldFolder_${index}`} className="flex-item-noshrink" />
                                    <label
                                        htmlFor={`oldFolder_${index}`}
                                        title={Name}
                                        className="flex-item-fluid-auto ellipsis"
                                    >
                                        <Icon
                                            name={
                                                typeof DestinationLabelID === 'undefined'
                                                    ? 'folder'
                                                    : FOLDER_ICONS[DestinationLabelID]
                                            }
                                            className="mr0-5 ml0-5 flex-item-noshrink"
                                        />
                                        {Name}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex-item-fluid pt0-5">
                    <ul className="unstyled m0">
                        {model.newFolders
                            .filter(({ DestinationLabelID }) => typeof DestinationLabelID !== 'undefined')
                            .map(({ DestinationLabelID, Name }) => {
                                return (
                                    <li
                                        key={DestinationLabelID}
                                        className="flex flex-nowrap flex-items-center pl1 pr1"
                                        style={{
                                            height: 50,
                                        }}
                                    >
                                        <Select
                                            className="flex-item-fluid"
                                            // options={[{ value: `${DestinationLabelID}`, text: Name }]}
                                            options={foldersOptions}
                                        />
                                        <Button className="flex-item-noshrink ml1">{c('Action').t`Add folder`}</Button>
                                    </li>
                                );
                            })}
                        {model.newFolders
                            .filter(({ DestinationLabelID }) => typeof DestinationLabelID === 'undefined')
                            .map(({ id, name }, index) => {
                                return (
                                    <li
                                        className="flex flex-nowrap flex-items-center pl1 pr1"
                                        style={{
                                            height: 50,
                                        }}
                                        key={index}
                                    >
                                        {/*
                                        <Icon name="folder" className="mr0-5 flex-item-noshrink" />
                                        <input
                                            type="text"
                                            value={name}
                                            className="flex-item-fluid"
                                            onChange={({ target }) => {
                                                const newFolders = [...model.newFolders];
                                                const i = model.newFolders.findIndex(
                                                    (folder) => folder.id === id
                                                );
                                                newFolders[i].name = target.value;
                                                setModel({ ...model, newFolders });
                                            }}
                                        />
                                    */}
                                        <Select
                                            className="flex-item-fluid"
                                            // options={[{ value: id, text: name }]}
                                            options={foldersOptions}
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
