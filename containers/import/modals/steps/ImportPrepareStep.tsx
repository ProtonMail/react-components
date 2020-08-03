import React, { useMemo } from 'react';
import { Icon, Button, useModals } from '../../../..';
import { c, msgid } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import { ImportModalModel } from '../../interfaces';
import ImportSize from '../ImportSize';
import CustomizedImportModal from '../CustomizedImportModal';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    address: Address;
}

const ImportPrepareStep = ({ model, setModel, address }: Props) => {
    const { createModal } = useModals();

    const messagesFound = useMemo(() => model.oldFolders.reduce((acc, { Total }) => acc + Total, 0), [
        model.oldFolders,
    ]);

    const foldersFound = useMemo(() => model.oldFolders.length, [model.oldFolders]);

    const onClickCustomize = () => {
        createModal(<CustomizedImportModal address={address} model={model} setModel={setModel} />);
    };

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
                    {/* @todo Fix import Size */}
                    <ImportSize ID={model.importID} Code={model.password} />
                </div>

                <div className="mb0-5 flex flex-items-center">
                    <Icon className="mr0-5" name="mailbox" />
                    {c('Info').t`Import mailbox`}
                </div>

                <div className="mb0-5 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="all-emails" />
                    {c('Info').ngettext(
                        msgid`${messagesFound} message has been found`,
                        `${messagesFound} messages have been found`,
                        messagesFound
                    )}
                </div>

                <div className="mb0-5 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="parent-folder" />
                    {c('Info').ngettext(
                        msgid`${foldersFound} folder has been found`,
                        `${foldersFound} folders have been found`,
                        foldersFound
                    )}
                </div>

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="clock" />
                    {c('Info').t`Import all messages from the beginning of the time`}
                </div>

                <Button onClick={onClickCustomize}>{c('Action').t`Customized Import`}</Button>
            </div>
        </>
    );
};

export default ImportPrepareStep;
