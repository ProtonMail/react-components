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
    PrimaryButton,
    Loader,
    Icon,
    Input,
    useApi,
    useLoading,
    useUser
} from 'react-components';
import { getAuthenticationMethod, createMailImport } from 'proton-shared/lib/api/mailImport';

const STEPS = {
    START: 'start',
    PREPARE: 'prepare',
    STARTED: 'started'
};

const DEFAULT_MODEL = {
    step: STEPS.START,
    needDetails: false,
    email: '',
    password: '',
    port: '',
    imap: '',
    errorCode: 0
};

const ERROR = {
    AUTH_IMAP: 2000
};

const ImportMailModal = ({ ...rest }) => {
    const [loading, withLoading] = useLoading();
    const [user] = useUser();
    const [model, setModel] = useState(DEFAULT_MODEL);
    const api = useApi();
    const title = useMemo(() => {
        if (model.step === STEPS.START) {
            return c('Title').t`Start a new import`;
        }
        if (model.step === STEPS.PREPARE) {
            return c('Title').t`Start import process`;
        }
        if (model.step === STEPS.STARTED) {
            return c('Title').t`Import started`;
        }
        return '';
    }, [model.step]);

    const submit = useMemo(() => {
        if (model.step === STEPS.START) {
            return <PrimaryButton type="submit" loading={loading}>{c('Action').t`Next`}</PrimaryButton>;
        }
        if (model.step === STEPS.PREPARE) {
            return <PrimaryButton type="submit">{c('Action').t`Start import`}</PrimaryButton>;
        }
        if (model.step === STEPS.STARTED) {
            return <PrimaryButton type="submit">{c('Action').t`Close`}</PrimaryButton>;
        }
        return null;
    }, [model.step, loading]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (model.step === STEPS.START && model.needDetails) {
            try {
                await api(
                    createMailImport({
                        Email: model.email,
                        ImapHost: model.imap,
                        ImapPort: model.port,
                        Sasl: 'PLAIN',
                        Code: model.password
                    })
                );
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

            setModel({
                ...model,
                step: STEPS.PREPARE
            });
            return;
        }

        if (model.step === STEPS.START) {
            const { Authentication } = await api(getAuthenticationMethod({ Email: model.email }));
            const { ImapHost, ImapPort } = Authentication;

            if (Authentication.ImapHost) {
                try {
                    await api(
                        createMailImport({
                            Email: model.email,
                            ImapHost,
                            ImapPort,
                            Sasl: 'PLAIN',
                            Code: model.password
                        })
                    );
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

                setModel({
                    ...model,
                    step: STEPS.PREPARE
                });
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

        if (model.step === STEPS.PREPARE) {
            // TODO start import process
            // await api();
            setModel({
                ...model,
                step: STEPS.STARTED
            });
            return;
        }

        if (model.step === STEPS.STARTED) {
            rest.onClose();
            return;
        }
    };

    return (
        <FormModal
            title={title}
            loading={loading}
            submit={submit}
            onSubmit={(e: FormEvent<HTMLFormElement>) => withLoading(handleSubmit(e))}
            {...rest}
        >
            {model.step === STEPS.START ? (
                <>
                    {model.errorCode === ERROR.AUTH_IMAP ? (
                        <Alert type="error">
                            <div>{c('Error')
                                .t`Server error. We cannot connect to your mail service provider. Please check if:`}</div>
                            <ul>
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
            {model.step === STEPS.PREPARE ? (
                <>
                    <div className="mb1">
                        <span className="mr1">{c('Label').t`Email:`}</span>
                        <strong>{model.email}</strong>
                    </div>
                    <hr />
                    <div className="mb1 aligncenter">
                        <div className="mb1">{c('Info').t`Calculating import data size...`}</div>
                        <Loader />
                    </div>
                    <hr />
                    <div className="flex mb1">
                        <div className="flex-item-fluid">
                            <span className="mr1">{c('Label').t`From`}</span>
                            <strong>{model.email}</strong>
                        </div>
                        <div className="flex-item-fluid">
                            <span className="mr1">{c('Label').t`To`}</span>
                            <strong>{user.Email}</strong>
                        </div>
                    </div>
                </>
            ) : null}
            {model.step === STEPS.STARTED ? (
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
