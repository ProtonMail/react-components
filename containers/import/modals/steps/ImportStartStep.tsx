import React, { ChangeEvent } from 'react';
import { Row, Label, Field, Input, Alert, EmailInput, PasswordInput } from '../../../..';
import { c } from 'ttag';

import { ImportModalModel, IMPORT_ERROR } from '../../interfaces';

interface Props {
    model: ImportModalModel;
    setModel: React.Dispatch<React.SetStateAction<ImportModalModel>>;
}

const ImportStartStep = ({ model, setModel }: Props) => (
    <>
        {[IMPORT_ERROR.AUTH_IMAP, IMPORT_ERROR.AUTH_CREDENTIALS].includes(model.errorCode) ? (
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
        {model.needDetails && (
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
        )}
    </>
);

export default ImportStartStep;
