import React, { ChangeEvent, useMemo, useEffect } from 'react';
import { c } from 'ttag';

import { validateEmailAddress } from 'proton-shared/lib/helpers/email';

import { Alert, Row, Label, Field, PasswordInput, EmailInput, Input } from '../../../../components';

import { INVALID_CREDENTIALS_ERROR_LABEL, IMAP_CONNECTION_ERROR_LABEL } from '../../constants';
import { ImportModalModel, IMPORT_ERROR } from '../../interfaces';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
}

const ImportStartStep = ({ modalModel, updateModalModel }: Props) => {
    const showPassword = useMemo(() => validateEmailAddress(modalModel.email), [modalModel.email]);

    useEffect(() => {
        if (!showPassword) {
            updateModalModel({ ...modalModel, password: '' });
        }
    }, [showPassword]);

    return (
        <>
            {[IMPORT_ERROR.AUTH_IMAP, IMPORT_ERROR.AUTH_CREDENTIALS].includes(modalModel.errorCode) ? (
                <Alert type="error" learnMore="https://protonmail.com/support/knowledge-base/">
                    {modalModel.errorLabel === INVALID_CREDENTIALS_ERROR_LABEL && (
                        <>
                            <div className="mb1">
                                {c('Error')
                                    .t`Proton cannot connect to your email server provider. Please make sure you:`}
                            </div>
                            <ul className="m0 pb1">
                                <li>{c('Error').t`enabled IMAP access on your external account`}</li>
                                <li>{c('Error').t`entered the correct email address and password`}</li>
                            </ul>
                        </>
                    )}
                    {modalModel.errorLabel === IMAP_CONNECTION_ERROR_LABEL && (
                        <>
                            <div className="mb1">
                                {c('Error').t`Proton cannot connect to your email server provider. Please make sure:`}
                            </div>
                            <ul className="m0 pb1">
                                <li>{c('Error').t`IMAP access on your external account is enabled`}</li>
                                <li>{c('Error').t`the mail server address and port number are correct`}</li>
                            </ul>
                        </>
                    )}
                </Alert>
            ) : (
                <>
                    <Alert>{c('Info').t`Enter the address of the email account you want to import from`}</Alert>
                    {showPassword && (
                        <Alert type="warning" learnMore="https://protonmail.com/support/knowledge-base/">
                            {c('Warning')
                                .t`By sharing your login credentials, you are giving Proton permission to fetch data from your external email provider. We will delete your login information once the import is complete.`}
                        </Alert>
                    )}
                </>
            )}
            <Row>
                <Label htmlFor="emailAddress">{c('Label').t`Email`}</Label>
                <Field>
                    <EmailInput
                        id="emailAddress"
                        value={modalModel.email}
                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                            updateModalModel({ ...modalModel, email: target.value })
                        }
                        autoFocus
                        required
                        isSubmitted={!!modalModel.errorLabel}
                        error={
                            modalModel.errorLabel === INVALID_CREDENTIALS_ERROR_LABEL
                                ? modalModel.errorLabel
                                : undefined
                        }
                        errorZoneClassName="hidden"
                    />
                </Field>
            </Row>

            {showPassword && (
                <Row>
                    <Label htmlFor="password">{c('Label').t`Password`}</Label>
                    <Field>
                        <PasswordInput
                            id="password"
                            value={modalModel.password}
                            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                updateModalModel({ ...modalModel, password: target.value })
                            }
                            required
                            isSubmitted={!!modalModel.errorLabel}
                            error={
                                modalModel.errorLabel === INVALID_CREDENTIALS_ERROR_LABEL
                                    ? modalModel.errorLabel
                                    : undefined
                            }
                            errorZoneClassName="hidden"
                        />
                    </Field>
                </Row>
            )}

            {modalModel.needIMAPDetails && modalModel.email && showPassword && (
                <>
                    <Row>
                        <Label htmlFor="imap">{c('Label').t`Mail Server (IMAP)`}</Label>
                        <Field>
                            <Input
                                id="imap"
                                placeholder="imap.domain.com"
                                value={modalModel.imap}
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    updateModalModel({ ...modalModel, imap: target.value })
                                }
                                required
                                isSubmitted={!!modalModel.errorLabel}
                                error={
                                    modalModel.errorLabel === IMAP_CONNECTION_ERROR_LABEL
                                        ? modalModel.errorLabel
                                        : undefined
                                }
                                errorZoneClassName="hidden"
                            />
                        </Field>
                    </Row>
                    <Row>
                        <Label htmlFor="port">{c('Label').t`Port`}</Label>
                        <Field>
                            <Input
                                id="port"
                                placeholder="993"
                                value={modalModel.port}
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    updateModalModel({ ...modalModel, port: target.value })
                                }
                                required
                                isSubmitted={!!modalModel.errorLabel}
                                error={
                                    modalModel.errorLabel === IMAP_CONNECTION_ERROR_LABEL
                                        ? modalModel.errorLabel
                                        : undefined
                                }
                                errorZoneClassName="hidden"
                            />
                        </Field>
                    </Row>
                </>
            )}
        </>
    );
};

export default ImportStartStep;
