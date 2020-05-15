import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Input, Label } from 'react-components';

interface Props {
    password: string;
    setPassword: (newPassword: string) => void;
}

const UnlockForm = ({ password, setPassword }: Props) => {
    return (
        <div className="flex onmobile-flex-column mb1">
            <Label htmlFor="password" className="mr1">{c('Label').t`Mailbox password`}</Label>
            <div className="flex-item-fluid">
                <Input
                    type="password"
                    name="password"
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="password"
                    required
                    className="w100 mb1"
                    value={password}
                    placeholder={c('Placeholder').t`Mailbox password`}
                    onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setPassword(value)}
                    data-cy-login="mailbox password"
                />
            </div>
        </div>
    );
};

export default UnlockForm;
