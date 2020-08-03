import React, { useState } from 'react';
import {
    Icon,
    Row,
    Label as FormLabel,
    Field,
    FormModal,
    useModals,
    ConfirmModal,
    Alert,
    Checkbox,
    DropdownActions,
} from '../../..';
import { format } from 'date-fns';
import { c, msgid } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { Address } from 'proton-shared/lib/interfaces';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import EditLabelModal from '../../labels/modals/Edit';

import { ImportModalModel, DestinationLabelID } from '../interfaces';
import { Button } from '../../../components/button';
import Tooltip from '../../../components/tooltip/Tooltip';
import Select from '../../../components/select/Select';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
    address: Address;
    onClose?: () => void;
}

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

interface CustomizedImportModel {
    label: Partial<Label>;
}

const CustomizedImportModal = ({ model, setModel, address, onClose = noop, ...rest }: Props) => {
    /*
    This modal would have its own state
    then onSubmit send it to the setModel
    onClose should add the confirmModel to avoid loosing internal state
    */
    const [customizedImportModel, setCustomizedImportModel] = useState<CustomizedImportModel>({
        label: {
            Name: `${model.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd')}`,
            Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
            Type: LABEL_TYPE.MESSAGE_LABEL,
            Order: 0,
        },
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

    const handleEditLabel = async () => {
        const label: Label = await new Promise((resolve, reject) => {
            createModal(
                <EditLabelModal
                    label={customizedImportModel.label}
                    type="label"
                    onEdit={resolve}
                    onClose={reject}
                    mode="edition"
                    doNotSave
                />
            );
        });

        setCustomizedImportModel({ ...customizedImportModel, label });
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
                                title={customizedImportModel.label.Name}
                                style={{ color: customizedImportModel.label.Color }}
                            >
                                <span className="pm-badgeLabel-link ellipsis color-white nodecoration">
                                    {customizedImportModel.label.Name}
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
                            options={[
                                {
                                    value: 'pois',
                                    text: c('Tooltip').t`From the beginning of time`,
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
                                className="mr0-5"
                                style={
                                    !organizeFolderVisible
                                        ? {
                                              transform: 'rotate(-90deg)',
                                          }
                                        : undefined
                                }
                            />
                            {c('Action').t`Organize folders`}
                        </Button>
                    </FormLabel>
                    <Field className="flex flex-items-center">
                        <Icon name="parent-folder" className="mr0-5" />
                        {c('Info').ngettext(
                            msgid`${model.newFolders.length} folder selected`,
                            `${model.newFolders.length} folders selected`,
                            model.newFolders.length
                        )}
                    </Field>
                </Row>
            </div>

            {organizeFolderVisible && (
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
                                                {/*
                                                    <span title={Name} className="ellipsis">
                                                        {Name}
                                                    </span>
                                                */}
                                                <Select
                                                    className="flex-item-fluid"
                                                    options={[{ value: `${DestinationLabelID}`, text: Name }]}
                                                />
                                                <Button className="flex-item-noshrink ml1">
                                                    {c('Action').t`Add folder`}
                                                </Button>
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
                                                    options={[{ value: id, text: name }]}
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
            )}
        </FormModal>
    );
};

export default CustomizedImportModal;
