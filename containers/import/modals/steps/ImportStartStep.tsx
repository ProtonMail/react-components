import React, { ChangeEvent } from 'react';
import { Row, Label, Field, Input, Alert, EmailInput, PasswordInput } from '../../../..';
import { c } from 'ttag';

import { ImportModalModel, IMPORT_ERROR } from '../../interfaces';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
}

const ImportStartStep = ({ modalModel, updateModalModel }: Props) => (
    <>
        {[IMPORT_ERROR.AUTH_IMAP, IMPORT_ERROR.AUTH_CREDENTIALS].includes(modalModel.errorCode) ? (
            <Alert type="error">
                <div className="mb1">
                    {c('Error').t`Server error. We cannot connect to your mail service provider. Please check if:`}
                </div>
                <ul className="m0">
                    <li>{c('Error').t`IMAP is enabled`}</li>
                    <li>{c('Error').t`Password and mail address are correct`}</li>
                    <li>
                        {c('Error')
                            .t` If you are using Gmail, Yahoo, Yandex or FastMail, make sure you are using an app password`}
                    </li>
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
                    value={modalModel.password}
                    onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                        updateModalModel({ ...modalModel, password: target.value })
                    }
                    required
                />
            </Field>
        </Row>
        {modalModel.needDetails && (
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
                        />
                    </Field>
                </Row>
            </>
        )}
    </>
);

export default ImportStartStep;
