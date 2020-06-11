import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from 'proton-shared/lib/constants';

import { Input, Label, PasswordInput } from '../../index';

interface Props {
    username: string;
    setUsername: (newUsername: string) => void;
    password: string;
    setPassword: (newPassword: string) => void;
}

const PasswordForm = ({ username, setUsername, password, setPassword }: Props) => {
    return (
        <>
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="login">{c('Label').t`Email or Username`}</Label>
                <div className="flex-item-fluid">
                    <Input
                        type="text"
                        name="login"
                        autoFocus
                        autoCapitalize="off"
                        autoCorrect="off"
                        id="login"
                        required
                        value={username}
                        placeholder={EMAIL_PLACEHOLDER}
                        onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setUsername(value)}
                        data-cy-login="username"
                    />
                </div>
            </div>
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="password">{c('Label').t`Password`}</Label>
                <div className="flex-item-fluid">
                    <div className="mb0-5">
                        <PasswordInput
                            name="password"
                            autoComplete="current-password"
                            id="password"
                            required
                            value={password}
                            placeholder={PASSWORD_PLACEHOLDER}
                            onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setPassword(value)}
                            data-cy-login="password"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordForm;
