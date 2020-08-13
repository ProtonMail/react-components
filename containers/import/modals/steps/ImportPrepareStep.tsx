import React, { useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { c, msgid } from 'ttag';

// import humanSize from 'proton-shared/lib/helpers/humanSize';
import { Address } from 'proton-shared/lib/interfaces';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import { Icon, Button, useModals } from '../../../..';

import { ImportModalModel, ImportModel } from '../../interfaces';
// import { TIME_UNIT, timeUnitLabels } from '../../constants';
import CustomizedImportModal from '../CustomizedImportModal';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    importModel: ImportModel;
    updateImportModel: (newModel: ImportModel) => void;
    address: Address;
}

const ImportPrepareStep = ({ modalModel, updateModalModel, importModel, updateImportModel, address }: Props) => {
    const { createModal } = useModals();
    const { providerFolders, password } = modalModel;

    const foldersFound = useMemo(() => providerFolders.length, [providerFolders]);
    const messagesFound = useMemo(() => providerFolders.reduce((acc, { Total }) => acc + Total, 0), [providerFolders]);

    /*  @todo Missing Size in folders */
    // const importSize = useMemo(() => providerFolders.reduce((acc, { Size = 0 }) => acc + Size, 0), [providerFolders]);

    const onClickCustomize = () => {
        createModal(
            <CustomizedImportModal
                address={address}
                modalModel={modalModel}
                updateModalModel={updateModalModel}
                importModel={importModel}
                updateImportModel={updateImportModel}
            />
        );
    };

    useEffect(() => {
        const Mapping = providerFolders.map((folder) => ({
            Source: folder.Name,
            Destinations: {
                FolderName: folder.DestinationFolder || folder.Name,
            },
        }));

        updateImportModel({
            AddressID: address.ID,
            Code: password,
            Mapping,
            selectedPeriod: importModel.selectedPeriod,
            // @todo might end up optional
            ImportLabel: {
                Name: `${modalModel.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd')}`,
                Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
                Type: LABEL_TYPE.MESSAGE_LABEL,
                Order: 0,
            },
        });
    }, []);

    return (
        <>
            <div className="flex pb1 mb1 border-bottom">
                <div className="flex-item-fluid ellipsis mr0-5">
                    <span>{c('Label').t`From`}</span>
                    {`: `}
                    <strong>{modalModel.email}</strong>
                </div>
                <div className="flex-item-fluid ellipsis ml0-5 alignright">
                    <span>{c('Label').t`To`}</span>
                    {`: `}
                    <strong>{address.Email}</strong>
                </div>
            </div>

            <div className="pb1 mb1 border-bottom">
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

                {/* @todo use enum and labels here, put that in one of the model somehow */}
                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="clock" />
                    {importModel.StartTime && importModel.EndTime
                        ? c('Info').t`Import all messages from ${format(
                              importModel.StartTime,
                              'd MMM yyyy'
                          )} to ${format(importModel.EndTime, 'd MMM yyyy')}`
                        : c('Info').t`Import all messages from the beginning of the time`}
                </div>

                <Button onClick={onClickCustomize}>{c('Action').t`Customized Import`}</Button>
            </div>
        </>
    );
};

export default ImportPrepareStep;
