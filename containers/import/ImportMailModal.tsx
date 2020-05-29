import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { c } from 'ttag';
import {
    Alert,
    FormModal,
    EmailInput,
    PasswordInput,
    Label,
    Row,
    Field,
    ConfirmModal,
    PrimaryButton,
    Button,
    Icon,
    Input,
    useApi,
    useModals,
    useLoading,
    useAddresses,
    generateUID
} from 'react-components';
import {
    getAuthenticationMethod,
    createMailImport,
    createJobImport,
    getMailImportFolders
} from 'proton-shared/lib/api/mailImport';

import ImportSize from './ImportSize';
import { MailImportFolderModel, Step, ModalModel, MailImportFolder, DestinationLabelID } from './interfaces';

const DEFAULT_MODEL = {
    step: Step.START,
    needDetails: false,
    importID: '',
    email: '',
    password: '',
    port: '',
    imap: '',
    errorCode: 0,
    newFolders: [],
    oldFolders: []
};

const ERROR = {
    AUTH_IMAP: 2000
};

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
    [DestinationLabelID.ALL_MAIL]: 'all-emails'
};

const prepareFolders = (folders: MailImportFolder[]): MailImportFolderModel[] =>
    folders.map((folder) => ({ ...folder, id: generateUID('folder'), name: folder.Name }));

const ImportMailModal = ({ ...rest }) => {
    const [loading, withLoading] = useLoading();
    const { createModal } = useModals();
    const [addresses] = useAddresses();
    const [address] = addresses || [];
    const [model, setModel] = useState<ModalModel>(DEFAULT_MODEL);
    const api = useApi();
    const title = useMemo(() => {
        if (model.step === Step.START) {
            return c('Title').t`Start a new import`;
        }
        if (model.step === Step.PREPARE) {
            return c('Title').t`Start import process`;
        }
        if (model.step === Step.STARTED) {
            return c('Title').t`Import in progress`;
        }
        return '';
    }, [model.step]);

    const submit = useMemo(() => {
        if (model.step === Step.START) {
            return <PrimaryButton type="submit" loading={loading}>{c('Action').t`Next`}</PrimaryButton>;
        }
        if (model.step === Step.PREPARE) {
            return <PrimaryButton type="submit">{c('Action').t`Start import`}</PrimaryButton>;
        }
        if (model.step === Step.STARTED) {
            return <PrimaryButton type="submit">{c('Action').t`Close`}</PrimaryButton>;
        }
        return null;
    }, [model.step, loading]);

    const handleCancel = async () => {
        await new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Warning').t`Are you sure you want to cancel mails import?`}</Alert>
                </ConfirmModal>
            );
        });
        rest.onClose();
    };

    const cancel = useMemo(() => {
        if (model.step === Step.START) {
            return <Button loading={loading} onClick={() => handleCancel()}>{c('Action').t`Cancel`}</Button>;
        }
        if (model.step === Step.PREPARE) {
            return <Button loading={loading} onClick={() => handleCancel()}>{c('Action').t`Cancel`}</Button>;
        }
        return null;
    }, [model.step, loading]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setModel({
            ...model,
            errorCode: 0
        });

        if (model.step === Step.START && model.needDetails) {
            try {
                const { Import } = await api(
                    createMailImport({
                        Email: model.email,
                        ImapHost: model.imap,
                        ImapPort: parseInt(model.port),
                        Sasl: 'PLAIN',
                        Code: model.password
                    })
                );
                const { Folders = [] } = await api(getMailImportFolders(Import.ID));
                setModel({
                    ...model,
                    newFolders: prepareFolders(Folders),
                    oldFolders: Folders,
                    importID: Import.ID,
                    step: Step.PREPARE
                });
            } catch (error) {
                const { data: { Code } = { Code: 0 } } = error;

                if (Code === ERROR.AUTH_IMAP) {
                    setModel({
                        ...model,
                        errorCode: Code
                    });
                    return;
                }
            }

            return;
        }

        if (model.step === Step.START) {
            const { Authentication } = await api(getAuthenticationMethod({ Email: model.email }));
            const { ImapHost, ImapPort } = Authentication;

            if (Authentication.ImapHost) {
                try {
                    const { Import } = await api(
                        createMailImport({
                            Email: model.email,
                            ImapHost,
                            ImapPort,
                            Sasl: 'PLAIN',
                            Code: model.password
                        })
                    );
                    const { Folders = [] } = await api(getMailImportFolders(Import.ID));
                    setModel({
                        ...model,
                        newFolders: prepareFolders(Folders),
                        oldFolders: Folders,
                        importID: Import.ID,
                        step: Step.PREPARE
                    });
                } catch (error) {
                    const { data: { Code } = { Code: 0 } } = error;

                    if (Code === ERROR.AUTH_IMAP) {
                        setModel({
                            ...model,
                            errorCode: Code
                        });
                        return;
                    }
                }
            } else {
                setModel({
                    ...model,
                    imap: '',
                    port: ImapPort,
                    needDetails: true
                });
            }
            return;
        }

        if (model.step === Step.PREPARE) {
            await api(
                createJobImport(model.importID, {
                    AddressID: address.ID,
                    Folders: model.newFolders.map(({ name, Name, DestinationLabelID }) => {
                        if (typeof DestinationLabelID !== 'undefined') {
                            return {
                                SourceFolder: Name,
                                DestinationLabelID
                            };
                        }
                        return {
                            SourceFolder: Name,
                            DestinationLabelName: name
                        };
                    })
                })
            );
            setModel({
                ...model,
                step: Step.STARTED
            });
            return;
        }

        if (model.step === Step.STARTED) {
            rest.onClose();
            return;
        }
    };

    return (
        <FormModal
            title={title}
            loading={loading}
            submit={submit}
            cancel={cancel}
            onSubmit={(e: FormEvent<HTMLFormElement>) => withLoading(handleSubmit(e))}
            {...rest}
        >
            {model.step === Step.START ? (
                <>
                    {model.errorCode === ERROR.AUTH_IMAP ? (
                        <Alert type="error">
                            <div className="mb1">{c('Error')
                                .t`Server error. We cannot connect to your mail service provider. Please check if:`}</div>
                            <ul className="m0">
                                <li>{c('Error').t`IMAP is enabled`}</li>
                                <li>{c('Error').t`Password and mail address is correct`}</li>
                                <li>{c('Error').t` If it's a Gmail or Yahoo, please use an app password`}</li>
                            </ul>
                        </Alert>
                    ) : null}
                    <Row>
                        <Label htmlFor="emailAddress">{c('Label').t`Email`}</Label>
                        <Field>
                            <EmailInput
                                id="emailAddress"
                                value={model.email}
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    setModel({ ...model, email: target.value })
                                }
                                autoFocus={true}
                                required
                            />
                        </Field>
                    </Row>
                    <Row>
                        <Label htmlFor="password">{c('Label').t`Password`}</Label>
                        <Field>
                            <PasswordInput
                                id="password"
                                value={model.password}
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    setModel({ ...model, password: target.value })
                                }
                                required
                            />
                        </Field>
                    </Row>
                    {model.needDetails ? (
                        <>
                            <Row>
                                <Label htmlFor="imap">{c('Label').t`IMAP server`}</Label>
                                <Field>
                                    <Input
                                        id="imap"
                                        placeholder="imap.domain.com"
                                        value={model.imap}
                                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                            setModel({ ...model, imap: target.value })
                                        }
                                        required
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Label htmlFor="port">{c('Label').t`Port`}</Label>
                                <Field>
                                    <Input
                                        id="port"
                                        placeholder="993"
                                        value={model.port}
                                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                            setModel({ ...model, port: target.value })
                                        }
                                        required
                                    />
                                </Field>
                            </Row>
                        </>
                    ) : null}
                </>
            ) : null}
            {model.step === Step.PREPARE ? (
                <>
                    <div className="mb1">
                        <span className="mr1">{c('Label').t`Email:`}</span>
                        <strong>{model.email}</strong>
                    </div>
                    <hr />
                    <div className="mb1">
                        <div className="mb0-5">
                            <ImportSize ID={model.importID} />
                        </div>
                        <div className="mb0-5">{c('Info').t`${model.oldFolders.reduce(
                            (acc, { Total }) => acc + Total,
                            0
                        )} messages have been found`}</div>
                        <div>{c('Info').t`${model.oldFolders.length} folders have been found`}</div>
                    </div>
                    <hr />
                    <div className="flex mb1">
                        <div className="flex-item-fluid">
                            <div className="mb1">
                                <span className="mr1">{c('Label').t`From`}</span>
                                <strong>{model.email}</strong>
                            </div>
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
                            <div className="mb1">
                                <span className="mr1">{c('Label').t`To`}</span>
                                <strong>{address.Email}</strong>
                            </div>
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
                                                        onChange={({ target }) => {
                                                            const newFolders = [...model.newFolders];
                                                            const i = model.newFolders.findIndex(
                                                                (folder) => folder.id === id
                                                            );
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
            ) : null}
            {model.step === Step.STARTED ? (
                <>
                    <div className="mb1 aligncenter">
                        <div className="mb1">{c('Info').t`Import in progress...`}</div>
                        <Icon name="import" className="fill-pm-blue" size={100} />
                    </div>
                </>
            ) : null}
        </FormModal>
    );
};

export default ImportMailModal;
