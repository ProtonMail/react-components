import React, { useMemo, useEffect, useRef } from 'react';
import { format, isValid } from 'date-fns';
import { c, msgid } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import { useFolders, useUser, useModals } from '../../../../hooks';
import { Icon, LabelStack, Button, Alert, Loader, Tooltip, InlineLinkButton } from '../../../../components';

import { ImportModalModel, MailImportFolder } from '../../interfaces';
import { timeUnitLabels, TIME_UNIT } from '../../constants';

import CustomizeImportModal from '../CustomizeImportModal';
import isDeepEqual from 'proton-shared/lib/helpers/isDeepEqual';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    address: Address;
}

const ImportPrepareStep = ({ modalModel, updateModalModel, address }: Props) => {
    const initialModel = useRef<ImportModalModel>(modalModel);
    const [user, userLoading] = useUser();
    const { createModal } = useModals();
    const { providerFolders, password } = modalModel;
    const [folders = [], foldersLoading] = useFolders();

    const providerFoldersNum = useMemo(() => providerFolders.length, [providerFolders]);
    const providerMessageNum = useMemo(() => providerFolders.reduce((acc, { Total }) => acc + Total, 0), [
        providerFolders,
    ]);
    const selectedFolders = useMemo(
        () =>
            modalModel.payload.Mapping.filter((m) => m.checked).map(
                (mappedFolder) =>
                    providerFolders.find((p) => p.Source === mappedFolder.Source) || ({} as MailImportFolder)
            ),
        [modalModel.payload.Mapping, providerFolders]
    );
    const selectedFoldersMessageCount = useMemo(() => selectedFolders.reduce((acc, { Total = 0 }) => acc + Total, 0), [
        modalModel.payload.Mapping,
        providerFolders,
    ]);

    const importSize = useMemo(() => selectedFolders.reduce((acc, { Size = 0 }) => acc + Size, 0), [selectedFolders]);

    const showSizeWarning = useMemo(() => importSize + user.UsedSpace >= user.MaxSpace * 2, [
        importSize,
        user.UsedSpace,
        user.MaxSpace,
    ]);
    const showFoldersNumError = useMemo(() => selectedFolders.length + folders.length >= 500, [
        selectedFolders,
        folders,
    ]);
    const showFoldersNameError = useMemo(
        () =>
            modalModel.payload.Mapping.some(
                (m) => m.checked && m.Destinations.FolderName && m.Destinations.FolderName.length >= 100
            ),
        [modalModel.payload.Mapping]
    );

    const handleClickCustomize = () => {
        createModal(
            <CustomizeImportModal
                address={address}
                modalModel={modalModel}
                updateModalModel={updateModalModel}
                customizeFoldersOpen={showFoldersNumError || showFoldersNameError}
            />
        );
    };

    const handleReset = () => {
        updateModalModel(initialModel.current);
    };

    const isCustom = useMemo(() => !isDeepEqual(initialModel.current.payload, modalModel.payload), [
        initialModel.current.payload,
        modalModel.payload,
    ]);

    useEffect(() => {
        updateModalModel({ ...modalModel, isPayloadValid: showFoldersNumError || showFoldersNameError });
    }, [showFoldersNumError, showFoldersNameError]);

    useEffect(() => {
        const Mapping = providerFolders.map((folder) => ({
            Source: folder.Source,
            Destinations: {
                FolderName: folder.DestinationFolder || folder.Source,
            },
            checked: true,
        }));

        const ImportLabel = {
            Name: `${modalModel.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
            Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
            Type: LABEL_TYPE.MESSAGE_LABEL,
            Order: 0,
        };

        const newModel = {
            ...modalModel,
            payload: {
                AddressID: address.ID,
                Code: password,
                Mapping,
                ImportLabel,
            },
        };

        updateModalModel(newModel);
        if (initialModel) {
            initialModel.current = newModel;
        }
    }, []);

    if (foldersLoading || userLoading) {
        return <Loader />;
    }

    return (
        <>
            {showSizeWarning && (
                <Alert type="warning" className="mt1 mb1" learnMore="https://protonmail.com/support/knowledge-base/">
                    {c('Warning')
                        .t`This import may exceed the storage capacity currently available in your Proton account.`}
                    <br />
                    {c('Warning')
                        .t`Proton will transfer as much data as possible, starting with your most recent messages.`}
                </Alert>
            )}

            {showFoldersNumError && (
                <Alert type="error" className="mt1 mb1">
                    {c('Error')
                        .t`There are too many folders in your external account. Please customize the import to delete some folders.`}
                </Alert>
            )}

            {showFoldersNameError && (
                <Alert type="error" className="mt1 mb1">
                    {c('Error')
                        .t`Some of your folder names exceed ProtonMail's maximum character limit. Please customize the import to edit these names.`}
                </Alert>
            )}

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
                <div className="mb1 flex flex-items-center">
                    <Icon className="mr0-5" name="mailbox" />
                    {c('Info').t`Import mailbox`}
                </div>

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="all-emails" />
                    {c('Info').ngettext(
                        msgid`${providerMessageNum} message found`,
                        `${providerMessageNum.toLocaleString()} messages found`,
                        providerMessageNum
                    )}
                </div>

                {selectedFoldersMessageCount !== providerMessageNum && (
                    <div className="mb1 ml2 flex flex-items-center">
                        <Icon className="mr0-5" name="all-emails" />
                        <strong>
                            {c('Info').ngettext(
                                msgid`${selectedFoldersMessageCount} message selected`,
                                `${selectedFoldersMessageCount.toLocaleString()} messages selected`,
                                selectedFoldersMessageCount
                            )}
                        </strong>
                    </div>
                )}

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="parent-folder" />
                    {c('Info').ngettext(
                        msgid`${providerFoldersNum} folder found`,
                        `${providerFoldersNum.toLocaleString()} folders found`,
                        providerFoldersNum
                    )}

                    {showFoldersNumError && (
                        <Tooltip
                            title={c('Tooltip').t`Customize import to reduce the number of folders`}
                            originalPlacement="right"
                        >
                            <Icon name="attention-plain" size={18} />
                        </Tooltip>
                    )}
                </div>

                {selectedFolders.length !== providerFoldersNum && (
                    <div className="mb1 ml2 flex flex-items-center">
                        <strong>
                            <Icon className="mr0-5" name="parent-folder" />
                            {c('Info').ngettext(
                                msgid`${selectedFolders.length} folder selected`,
                                `${selectedFolders.length.toLocaleString()} folders selected`,
                                selectedFolders.length
                            )}
                        </strong>
                    </div>
                )}

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="clock" />
                    {modalModel.selectedPeriod === TIME_UNIT.BIG_BANG ? (
                        c('Info').t`Import all messages since ${timeUnitLabels[
                            modalModel.selectedPeriod
                        ].toLowerCase()}`
                    ) : (
                        <span>
                            {c('Info').jt`Import all messages since`}
                            {` `}
                            <strong>{timeUnitLabels[modalModel.selectedPeriod]}</strong>
                        </span>
                    )}
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

                <div className="mt0-5 flex flex-items-center">
                    <Button onClick={handleClickCustomize}>{c('Action').t`Customize import`}</Button>
                    {showFoldersNameError && (
                        <Tooltip
                            title={c('Tooltip').t`Update folders name`}
                            className="ml0-5"
                            originalPlacement="right"
                        >
                            <Icon name="attention-plain" size={20} />
                        </Tooltip>
                    )}
                    {isCustom && isValid && (
                        <InlineLinkButton className="ml1" onClick={handleReset}>
                            {c('Action').t`Reset to default`}
                        </InlineLinkButton>
                    )}
                </div>
            </div>
        </>
    );
};

export default ImportPrepareStep;
