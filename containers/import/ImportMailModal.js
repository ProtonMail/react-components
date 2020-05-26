import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    FormModal,
    EmailInput,
    PasswordInput,
    Label,
    Row,
    Field,
    PrimaryButton,
    Input,
    useApi,
    useLoading
} from 'react-components';
import { getAuthenticationMethod, createMailImport } from 'proton-shared/lib/api/mailImport';

const STEPS = {
    START: 'start',
    PREPARE: 'prepare',
    STARTED: 'started'
};

const ImportMailModal = ({ ...rest }) => {
    const [loading, withLoading] = useLoading();
    const [model, setModel] = useState({ step: STEPS.START, needDetails: false, email: '', password: '', port: '' });
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
            return 'TODO';
        }
        if (model.step === STEPS.STARTED) {
            return 'TODO';
        }
        return null;
    }, [model.step, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (model.step === STEPS.START && model.needDetails) {
            await api(
                createMailImport({
                    Email: model.email,
                    ImapHost: model.imap,
                    ImapPort: model.port,
                    Sasl: 'PLAIN',
                    Code: model.password
                })
            );
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
                await api(
                    createMailImport({
                        Email: model.email,
                        ImapHost,
                        ImapPort,
                        Sasl: 'PLAIN',
                        Code: model.password
                    })
                );
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
            onSubmit={(e) => withLoading(handleSubmit(e))}
            submit={submit}
            {...rest}
        >
            {model.step === STEPS.START ? (
                <>
                    <Row>
                        <Label htmlFor="emailAddress">{c('Label').t`Email`}</Label>
                        <Field>
                            <EmailInput
                                id="emailAddress"
                                value={model.email}
                                onChange={({ target }) => setModel({ ...model, email: target.value })}
                                autoFocus
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
                                onChange={({ target }) => setModel({ ...model, password: target.value })}
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
                                        onChange={({ target }) => setModel({ ...model, imap: target.value })}
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
                                        onChange={({ target }) => setModel({ ...model, port: target.value })}
                                        required
                                    />
                                </Field>
                            </Row>
                        </>
                    ) : null}
                </>
            ) : null}
            {model.step === STEPS.PREPARE ? <></> : null}
            {model.step === STEPS.STARTED ? <></> : null}
        </FormModal>
    );
};

ImportMailModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ImportMailModal;
