import React, { useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { c, msgid } from 'ttag';

// import humanSize from 'proton-shared/lib/helpers/humanSize';
import { Address } from 'proton-shared/lib/interfaces';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import { Icon, Button, useModals, LabelStack } from '../../../..';

import { ImportModalModel } from '../../interfaces';
import { timeUnitLabels } from '../../constants';
import CustomizedImportModal from '../CustomizedImportModal';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    address: Address;
}

const ImportPrepareStep = ({ modalModel, updateModalModel, address }: Props) => {
    const { createModal } = useModals();
    const { providerFolders, password } = modalModel;

    const foldersFound = useMemo(() => providerFolders.length, [providerFolders]);
    const messagesFound = useMemo(() => providerFolders.reduce((acc, { Total }) => acc + Total, 0), [providerFolders]);

    /*  @todo Missing Size in folders */
    // const importSize = useMemo(() => providerFolders.reduce((acc, { Size = 0 }) => acc + Size, 0), [providerFolders]);

    const onClickCustomize = () => {
        createModal(
            <CustomizedImportModal address={address} modalModel={modalModel} updateModalModel={updateModalModel} />
        );
    };

    useEffect(() => {
        const Mapping = providerFolders.map((folder) => ({
            Source: folder.Name,
            Destinations: {
                FolderName: folder.DestinationFolder || folder.Name,
            },
        }));

        updateModalModel({
            ...modalModel,
            payload: {
                AddressID: address.ID,
                Code: password,
                Mapping,
                ImportLabel: {
                    Name: `${modalModel.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd')}`,
                    Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
                    Type: LABEL_TYPE.MESSAGE_LABEL,
                    Order: 0,
                },
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
                    {c('Info').t`Import all imported from ${timeUnitLabels[modalModel.selectedPeriod]}`}
                </div>

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="label" />
                    {c('Info').t`Label all imported messages as`}

                    {modalModel.payload.ImportLabel && modalModel.payload.ImportLabel.Name && (
                        <span className="ml0-5">
                            <LabelStack
                                labels={[
                                    {
                                        name: modalModel.payload.ImportLabel.Name,
                                        color: modalModel.payload.ImportLabel.Color,
                                        title: modalModel.payload.ImportLabel.Name,
                                    },
                                ]}
                                showDelete={false}
                            />
                        </span>
                    )}
                </div>

                <Button onClick={onClickCustomize}>{c('Action').t`Customized Import`}</Button>
            </div>
        </>
    );
};

export default ImportPrepareStep;
