import React from 'react';
import { c } from 'ttag';
import { EmailInput } from '../../index';

interface Props {
    email: string;
    setEmail: (email: string) => void;
    id: string;
}
const ResetPasswordInput = ({ email, setEmail, id }: Props) => {
    return (
        <EmailInput
            name="email"
            autoCapitalize="off"
            autoCorrect="off"
            id={id}
            placeholder={c('Placeholder').t`Recovery email`}
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            required
        />
    );
};

export default ResetPasswordInput;
