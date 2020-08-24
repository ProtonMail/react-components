import React, { useState, ChangeEvent, useMemo } from 'react';
import { subYears, subMonths } from 'date-fns';
import { c /* msgid */ } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { Address } from 'proton-shared/lib/interfaces';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import isDeepEqual from 'proton-shared/lib/helpers/isDeepEqual';

import EditLabelModal from '../../labels/modals/Edit';

import { useModals } from '../../../hooks';
import {
    Row,
    Tooltip,
    Alert,
    Field,
    Icon,
    LabelStack,
    Select,
    ConfirmModal,
    FormModal,
    PrimaryButton,
    Button,
    Label as FormLabel,
} from '../../../components';

import { ImportModalModel, ImportPayloadModel } from '../interfaces';
import { TIME_UNIT, timeUnitLabels } from '../constants';
// import OrganizeFolders from './OrganizeFolders';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    address: Address;
    onClose?: () => void;
    folders: Folder[];
}

const CustomizeImportModal = ({ modalModel, updateModalModel, address, folders, onClose = noop, ...rest }: Props) => {
    const initialPayload = modalModel.payload;
    const [customizedPayload, setCustomizedPayload] = useState<ImportPayloadModel>({ ...initialPayload });
    const [selectedPeriod, setSelectedPeriod] = useState<TIME_UNIT>(modalModel.selectedPeriod);
    // const [organizeFolderVisible, setOrganizeFolderVisible] = useState(false);
    const { createModal } = useModals();

    const hasChanged = useMemo(() => {
        if (
            customizedPayload.StartTime !== initialPayload.StartTime ||
            customizedPayload.EndTime !== initialPayload.EndTime ||
            !isDeepEqual(customizedPayload.Mapping, initialPayload.Mapping) ||
            !isDeepEqual(customizedPayload.ImportLabel, initialPayload.ImportLabel)
        ) {
            return true;
        }

        return false;
    }, [
        customizedPayload.ImportLabel,
        customizedPayload.StartTime,
        customizedPayload.EndTime,
        customizedPayload.Mapping,
    ]);

    // const handleChangePayload = (newPayload: ImportPayloadModel) => setCustomizedPayload(newPayload);

    const handleCancel = () => {
        if (!hasChanged) {
            onClose();
            return;
        }

        createModal(
            <ConfirmModal
                onConfirm={onClose}
                title={c('Action').t`Quit import customization?`}
                cancel={c('Action').t`Continue`}
                confirm={c('Action').t`Quit`}
            >
                <Alert type="error">{c('Warning').t`Any custom changes you made will be lost.`}</Alert>
            </ConfirmModal>
        );
    };

    // const toggleFolders = () => {
    //     setOrganizeFolderVisible(!organizeFolderVisible);
    // };

    const handleEditLabel = async () => {
        const ImportLabel: Label = await new Promise((resolve, reject) => {
            createModal(
                <EditLabelModal
                    label={customizedPayload.ImportLabel}
                    type="label"
                    onEdit={resolve}
                    onClose={reject}
                    mode="edition"
                    doNotSave
                />
            );
        });

        setCustomizedPayload({ ...customizedPayload, ImportLabel });
    };

    const handleChangePeriod = (selectedPeriod: TIME_UNIT) => {
        let StartTime: Date | undefined;
        let EndTime: Date | undefined = new Date();

        switch (selectedPeriod) {
            case TIME_UNIT.LAST_YEAR:
                StartTime = subYears(EndTime, 1);
                break;
            case TIME_UNIT.LAST_3_MONTHS:
                StartTime = subMonths(EndTime, 3);
                break;
            case TIME_UNIT.LAST_MONTH:
                StartTime = subMonths(EndTime, 1);
                break;
            default:
                StartTime = undefined;
                EndTime = undefined;
                break;
        }

        setSelectedPeriod(selectedPeriod);
        setCustomizedPayload({
            ...customizedPayload,
            StartTime,
            EndTime,
        });
    };

    // const selectedFoldersCount = customizedPayload.Mapping.filter((f) => !!f.Destinations.FolderName).length;

    const handleSubmit = () => {
        updateModalModel({
            ...modalModel,
            selectedPeriod,
            payload: customizedPayload,
        });
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Customize import`}
            submit={<PrimaryButton type="submit">{c('Action').t`Save`}</PrimaryButton>}
            close={<Button onClick={handleCancel}>{c('Action').t`Cancel`}</Button>}
            onSubmit={handleSubmit}
            onClose={handleCancel}
            style={{
                maxWidth: '84rem',
                width: '100%',
            }}
            {...rest}
        >
            <div className="mb1 pt1 border-bottom flex-items-center">
                <Row>
                    <FormLabel className="flex flex-items-center">
                        {c('Label').t`All messages labeled as`}
                        <Tooltip title={c('Tooltip').t`Each imported email will have this label`}>
                            <Icon name="info" className="ml0-5" />
                        </Tooltip>
                    </FormLabel>
                    <Field className="flex flex-items-center flex-nowrap">
                        {customizedPayload.ImportLabel && customizedPayload.ImportLabel.Name && (
                            <LabelStack
                                labels={[
                                    {
                                        name: customizedPayload.ImportLabel.Name,
                                        color: customizedPayload.ImportLabel.Color,
                                        title: customizedPayload.ImportLabel.Name,
                                    },
                                ]}
                                showDelete={false}
                            />
                        )}
                        <Button className="flex-item-noshrink ml1" onClick={handleEditLabel}>
                            {c('Action').t`Edit label`}
                        </Button>
                    </Field>
                </Row>
            </div>

            <div className="mb1 pt1 border-bottom flex-items-center">
                <Row>
                    <FormLabel className="flex flex-items-center">
                        {c('Label').t`Import messages since`}
                        <Tooltip title={c('Tooltip').t`The import will start with the most recent messages.`}>
                            <Icon name="info" className="ml0-5" />
                        </Tooltip>
                    </FormLabel>
                    <Field>
                        <Select
                            className="flex-item-fluid"
                            onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
                                handleChangePeriod(target.value as TIME_UNIT)
                            }
                            options={[
                                {
                                    value: TIME_UNIT.BIG_BANG,
                                    text: c('Option').t`${timeUnitLabels[TIME_UNIT.BIG_BANG]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_YEAR,
                                    text: c('Option').t`${timeUnitLabels[TIME_UNIT.LAST_YEAR]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_3_MONTHS,
                                    text: c('Option').t`${timeUnitLabels[TIME_UNIT.LAST_3_MONTHS]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_MONTH,
                                    text: c('Option').t`${timeUnitLabels[TIME_UNIT.LAST_MONTH]}`,
                                },
                            ]}
                            value={selectedPeriod}
                        />
                    </Field>
                </Row>
            </div>

            {/*
            <div className="mb1 pt1 flex-items-center">
                <Row>
                    <FormLabel>
                        <Button onClick={toggleFolders}>
                            <Icon
                                name="caret"
                                style={
                                    !organizeFolderVisible
                                        ? {
                                              transform: 'rotate(-90deg)',
                                          }
                                        : undefined
                                }
                            />
                            <span className="ml0-5">{c('Action').t`Manage folders`}</span>
                        </Button>
                    </FormLabel>
                    <Field className="flex flex-items-center">
                        <Icon name="parent-folder" className="mr0-5" />
                        {c('Info').ngettext(
                            msgid`${selectedFoldersCount} folder selected`,
                            `${selectedFoldersCount} folders selected`,
                            selectedFoldersCount
                        )}
                    </Field>
                </Row>
            </div>

            {organizeFolderVisible && (
                <OrganizeFolders
                    address={address}
                    modalModel={modalModel}
                    payload={customizedPayload}
                    onChangePayload={handleChangePayload}
                    folders={folders}
                />
            )}
            */}
        </FormModal>
    );
};

export default CustomizeImportModal;
