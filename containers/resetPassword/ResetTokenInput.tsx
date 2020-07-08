import { c } from 'ttag';
import React from 'react';
import { Input } from '../../index';

interface Props {
    id: string;
    token: string;
    setToken: (token: string) => void;
}
const ResetTokenInput = ({ id, token, setToken }: Props) => {
    return (
        <Input
            value={token}
            onChange={({ target }) => setToken(target.value)}
            name="resetToken"
            id={id}
            autoFocus
            required
            placeholder={c('Placeholder').t`Reset code`}
        />
    );
};

export default ResetTokenInput;
