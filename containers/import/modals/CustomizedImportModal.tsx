import React, { useState, ChangeEvent } from 'react';
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
import { format, subYears, subMonths } from 'date-fns';
import { c, msgid } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { Address } from 'proton-shared/lib/interfaces';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import EditLabelModal from '../../labels/modals/Edit';
import { ImportModalModel } from '../interfaces';
import OrganizeFolders from './OrganizeFolders';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    address: Address;
    onClose?: () => void;
}

enum TIME_UNIT {
    BIG_BANG = 'big_bang',
    LAST_YEAR = 'last_year',
    LAST_3_MONTHS = 'last_3_months',
    LAST_MONTH = 'last_month',
}

/* @todo
    Move this to ../interfaces.ts and its initialization to ./ImportMailModal.tsx
    since it's basically the payload that we want to send to the API
 */
interface FolderMapping {
    Source: string;
    Destinations: {
        FolderName: string;
    };
}

interface ImportModel {
    AddressID: string;
    Code: string;
    ImportLabel?: Partial<Label>;
    StartTime?: Date;
    EndTime?: Date;
    Mapping: FolderMapping[];
}

const CustomizedImportModal = ({ model, setModel, address, onClose = noop, ...rest }: Props) => {
    /*
    This modal would have its own state
    then onSubmit send it to the setModel
    onClose should add the confirmModel to avoid loosing internal state
    */
    const [customizedImportModel, setCustomizedImportModel] = useState<ImportModel>({
        AddressID: model.importID,
        Code: model.password,
        ImportLabel: {
            Name: `${model.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd')}`,
            Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
            Type: LABEL_TYPE.MESSAGE_LABEL,
            Order: 0,
        },
        Mapping: [],
    });

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

    const handleChangeTime = (period: TIME_UNIT) => {
        let StartTime: Date | undefined;
        let EndTime: Date | undefined = new Date();

        switch (period) {
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

        setCustomizedImportModel({ ...customizedImportModel, StartTime, EndTime });
    };

    return (
        <FormModal
            title={c('Title').t`Setup customized import`}
            // submit={submit}
            // onSubmit={(e: FormEvent<HTMLFormElement>) => withLoading(handleSubmit(e))}
            // close={cancel}
            onClose={handleCancel}
            style={{
                maxWidth: '84rem',
                width: '84rem',
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
                                handleChangeTime(target.value as TIME_UNIT)
                            }
                            options={[
                                {
                                    value: TIME_UNIT.BIG_BANG,
                                    text: c('Option').t`From the beginning of time`,
                                },
                                {
                                    value: TIME_UNIT.LAST_YEAR,
                                    text: c('Option').t`From last year`,
                                },
                                {
                                    value: TIME_UNIT.LAST_3_MONTHS,
                                    text: c('Option').t`From 3 last months`,
                                },
                                {
                                    value: TIME_UNIT.LAST_MONTH,
                                    text: c('Option').t`From last month`,
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
                            msgid`${model.providerFolders.length} folder selected`,
                            `${model.providerFolders.length} folders selected`,
                            model.providerFolders.length
                        )}
                    </Field>
                </Row>
            </div>

            {organizeFolderVisible && <OrganizeFolders address={address} model={model} setModel={setModel} />}
        </FormModal>
    );
};

export default CustomizedImportModal;
