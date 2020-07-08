import React from 'react';
import { c } from 'ttag';
import { Input } from '../../index';

interface Props {
    username: string;
    setUsername: (username: string) => void;
    id: string;
}

const ResetUsernameInput = ({ id, username, setUsername }: Props) => {
    return (
        <Input
            name="username"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            id={id}
            placeholder={c('Placeholder').t`Username`}
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
            required
        />
    );
};

export default ResetUsernameInput;
