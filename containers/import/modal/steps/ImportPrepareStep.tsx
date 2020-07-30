import React, { useMemo } from 'react';
import { Icon } from '../../../..';
import { c, msgid } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import { ImportModalModel, DestinationLabelID } from '../../interfaces';
import ImportSize from '../ImportSize';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    title: string;
    address: Address;
}

const GLOBAL_ICONS = {
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

const ImportPrepareStep = ({ model, setModel, address, title }: Props) => {
    const messagesFound = useMemo(() => model.oldFolders.reduce((acc, { Total }) => acc + Total, 0), [
        model.oldFolders,
    ]);

    const foldersFound = useMemo(() => model.oldFolders.length, [model.oldFolders]);

    return (
        <>
            <div className="flex pb1 mb1 border-bottom">
                <div className="flex-item-fluid ellipsis mr0-5">
                    <span>{c('Label').t`From`}</span>
                    {`: `}
                    <strong>{model.email}</strong>
                </div>
                <div className="flex-item-fluid ellipsis ml0-5 alignright">
                    <span>{c('Label').t`To`}</span>
                    {`: `}
                    <strong>{address.Email}</strong>
                </div>
            </div>

            <div className="pb1 mb1 border-bottom">
                <div className="mb0-5">
                    <ImportSize ID={model.importID} Code={model.password} />
                </div>
                <div className="mb0-5">
                    {c('Info').ngettext(
                        msgid`${messagesFound} message has been found`,
                        `${messagesFound} messages have been found`,
                        messagesFound
                    )}
                </div>
                <div>
                    {c('Info').ngettext(
                        msgid`${foldersFound} folder has been found`,
                        `${foldersFound} folders have been found`,
                        foldersFound
                    )}
                </div>
            </div>

            <div className="flex mb1">
                <div className="flex-item-fluid">
                    <ul className="unstyled m0">
                        {model.oldFolders.map(({ Name, DestinationLabelID }, index) => {
                            return (
                                <li key={index} className="flex flex-nowrap flex-items-center">
                                    <Icon
                                        name={
                                            typeof DestinationLabelID === 'undefined'
                                                ? 'folder'
                                                : GLOBAL_ICONS[DestinationLabelID]
                                        }
                                        className="mr0-5 flex-item-noshrink"
                                    />
                                    <span title={Name} className="ellipsis">
                                        {Name}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex-item-fluid">
                    <ul className="unstyled m0">
                        {model.newFolders
                            .filter(({ DestinationLabelID }) => typeof DestinationLabelID !== 'undefined')
                            .map(({ DestinationLabelID, Name }) => {
                                return (
                                    <li key={DestinationLabelID} className="flex flex-nowrap flex-items-center">
                                        <Icon
                                            name={
                                                typeof DestinationLabelID === 'undefined'
                                                    ? 'folder'
                                                    : GLOBAL_ICONS[DestinationLabelID]
                                            }
                                            className="mr0-5 flex-item-noshrink"
                                        />
                                        <span title={title} className="ellipsis">
                                            {Name}
                                        </span>
                                    </li>
                                );
                            })}
                        {model.newFolders
                            .filter(({ DestinationLabelID }) => typeof DestinationLabelID === 'undefined')
                            .map(({ id, name }, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {index === 0 && (
                                            <li className="flex flex-nowrap flex-items-center">
                                                <Icon name="folder" className="mr0-5 flex-item-noshrink" />
                                                <span title={title} className="ellipsis">
                                                    {address.Email}
                                                </span>
                                            </li>
                                        )}
                                        <li className="pl1 flex flex-nowrap flex-items-center">
                                            <Icon name="folder" className="mr0-5 flex-item-noshrink" />
                                            <input
                                                type="text"
                                                value={name}
                                                className="flex-item-fluid"
                                                onChange={({ target }) => {
                                                    const newFolders = [...model.newFolders];
                                                    const i = model.newFolders.findIndex((folder) => folder.id === id);
                                                    newFolders[i].name = target.value;
                                                    setModel({ ...model, newFolders });
                                                }}
                                            />
                                        </li>
                                    </React.Fragment>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ImportPrepareStep;
