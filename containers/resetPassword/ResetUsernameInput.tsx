import React from 'react';

import { Input } from '../../components';

interface Props {
    value: string;
    setValue: (username: string) => void;
    id: string;
    placeholder?: string;
}

const ResetUsernameInput = ({ id, value, setValue, placeholder }: Props) => {
    return (
        <Input
            name="username"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            required
        />
    );
};

export default ResetUsernameInput;
