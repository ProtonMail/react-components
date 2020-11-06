import React from 'react';
import { EmailInput } from '../../components';

interface Props {
    value: string;
    setValue: (email: string) => void;
    id: string;
}
const ResetPasswordEmailInput = ({ value, setValue, id }: Props) => {
    return (
        <EmailInput
            name="email"
            autoCapitalize="off"
            autoCorrect="off"
            autoFocus
            id={id}
            placeholder=""
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            required
        />
    );
};

export default ResetPasswordEmailInput;
