import React, { useState, ChangeEvent, useEffect } from 'react';
import {
    Icon,
    Row,
    Label as FormLabel,
    Field,
    FormModal,
    useModals,
    ConfirmModal,
    Alert,
    Button,
    Tooltip,
    Select,
} from '../../..';
import { subYears, subMonths } from 'date-fns';
import { c, msgid } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { Address } from 'proton-shared/lib/interfaces';
import { Label } from 'proton-shared/lib/interfaces/Label';

import EditLabelModal from '../../labels/modals/Edit';
import { ImportModalModel, ImportModel } from '../interfaces';
import { TIME_UNIT, timeUnitLabels } from '../constants';
import OrganizeFolders from './OrganizeFolders';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    importModel: ImportModel;
    updateImportModel: (newModel: ImportModel) => void;
    address: Address;
    onClose?: () => void;
}

const CustomizedImportModal = ({
    modalModel,
    updateModalModel,
    importModel,
    updateImportModel,
    address,
    onClose = noop,
    ...rest
}: Props) => {
    /*
        This modal would have its own state
        then onSubmit send it to the setModel
    */
    const [customizedImportModel, setCustomizedImportModel] = useState<ImportModel>(importModel);

    useEffect(() => {
        setCustomizedImportModel({
            AddressID: address.ID,
            Code: importModel.Code,
            ImportLabel: importModel.ImportLabel,
            Mapping: importModel.Mapping,
            selectedPeriod: importModel.selectedPeriod,
        });
    }, []);

    const [organizeFolderVisible, setOrganizeFolderVisible] = useState(false);
    const { createModal } = useModals();

    const handleCancel = () => {
        createModal(
            <ConfirmModal onConfirm={onClose}>
                <Alert type="error">
                    {c('Warning').t`Are you sure you want to stop the import setup?
Your configuration will be lost.`}
                </Alert>
            </ConfirmModal>
        );
    };

    const toggleFolders = () => {
        setOrganizeFolderVisible(!organizeFolderVisible);
    };

    const handleEditLabel = async () => {
        const ImportLabel: Label = await new Promise((resolve, reject) => {
            createModal(
                <EditLabelModal
                    label={customizedImportModel.ImportLabel}
                    type="label"
                    onEdit={resolve}
                    onClose={reject}
                    mode="edition"
                    doNotSave
                />
            );
        });

        setCustomizedImportModel({ ...customizedImportModel, ImportLabel });
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

        setCustomizedImportModel({
            ...customizedImportModel,
            StartTime,
            EndTime,
            selectedPeriod,
        });
    };

    const selectedFoldersCount = customizedImportModel.Mapping.filter((f) => !!f.Destinations.FolderName).length;

    const handleSubmit = () => {
        updateImportModel(customizedImportModel);
        onClose();
    };

    return (
        <FormModal
            title={c('Title').t`Setup customized import`}
            // submit={submit}
            // close={cancel}
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
                        {c('Label').t`Apply label to all messages`}
                        <Tooltip title={c('Tooltip').t`We will apply this label to all your imported emails`}>
                            <Icon name="info" className="ml0-5" />
                        </Tooltip>
                    </FormLabel>
                    <Field className="flex flex-items-center flex-nowrap">
                        <span className="inline-flex flew-row flex-items-center pm-badgeLabel-container">
                            <span
                                className="badgeLabel flex flex-row flex-items-center"
                                title={customizedImportModel.ImportLabel?.Name}
                                style={{ color: customizedImportModel.ImportLabel?.Color }}
                            >
                                <span className="pm-badgeLabel-link ellipsis color-white nodecoration">
                                    {customizedImportModel.ImportLabel?.Name}
                                </span>
                            </span>
                        </span>
                        <Button className="flex-item-noshrink ml1" onClick={handleEditLabel}>
                            {c('Action').t`Edit label`}
                        </Button>
                    </Field>
                </Row>
            </div>

            <div className="mb1 pt1 border-bottom flex-items-center">
                <Row>
                    <FormLabel className="flex flex-items-center">
                        {c('Label').t`Timeframe to import`}
                        <Tooltip title={c('Tooltip').t`From the newest to oldest order`}>
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
                                    text: c('Option').t`From ${timeUnitLabels[TIME_UNIT.BIG_BANG]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_YEAR,
                                    text: c('Option').t`From ${timeUnitLabels[TIME_UNIT.LAST_YEAR]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_3_MONTHS,
                                    text: c('Option').t`From ${timeUnitLabels[TIME_UNIT.LAST_3_MONTHS]}`,
                                },
                                {
                                    value: TIME_UNIT.LAST_MONTH,
                                    text: c('Option').t`From ${timeUnitLabels[TIME_UNIT.LAST_MONTH]}`,
                                },
                            ]}
                        />
                    </Field>
                </Row>
            </div>

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
                            <span className="ml0-5">{c('Action').t`Organize folders`}</span>
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
                    importModel={customizedImportModel}
                    setImportModel={setCustomizedImportModel}
                />
            )}
        </FormModal>
    );
};

export default CustomizedImportModal;
