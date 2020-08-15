import React, { ChangeEvent, useMemo } from 'react';
import { Row, Label, Field, Input, Alert, EmailInput, PasswordInput } from '../../../..';
import { c } from 'ttag';

import { validateEmailAddress } from 'proton-shared/lib/helpers/email';
import { ImportModalModel, IMPORT_ERROR } from '../../interfaces';
import { INVALID_CREDENTIALS_ERROR_LABEL, IMAP_CONNECTION_ERROR_LABEL } from '../../constants';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
}

const ImportStartStep = ({ modalModel, updateModalModel }: Props) => {
    const showPassword = useMemo(() => validateEmailAddress(modalModel.email), [modalModel.email]);

    return (
        <>
            {[IMPORT_ERROR.AUTH_IMAP, IMPORT_ERROR.AUTH_CREDENTIALS].includes(modalModel.errorCode) ? (
                <Alert type="error">
                    <div className="mb1">
                        {c('Error').t`Server error. We cannot connect to your mail service provider. Please check if:`}
                    </div>
                    <ul className="m0">
                        <li>{c('Error').t`IMAP access is enabled on your account`}</li>
                        {modalModel.errorLabel === INVALID_CREDENTIALS_ERROR_LABEL ? (
                            <li>{c('Error').t`Your login credentials are correct`}</li>
                        ) : (
                            <li>{c('Error').t`The mail server address and a port number are correct`}</li>
                        )}
                    </ul>
                </Alert>
            ) : (
                <Alert>{c('Info').t`To start an import please connect to your account`}</Alert>
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

            {modalModel.needIMAPDetails && (
                <>
                    <Row>
                        <Label htmlFor="imap">{c('Label').t`IMAP server`}</Label>
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
