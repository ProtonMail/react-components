import React from 'react';
import { c } from 'ttag';
import { ResetPasswordForm } from 'react-components';

import SignInLayout from './SignInLayout';

interface Props {
    onLogin: () => void;
}

const ResetPasswordContainer = ({ onLogin }: Props) => {
    return (
        <SignInLayout title={c('Title').t`Reset password`}>
            <ResetPasswordForm onLogin={onLogin} />
        </SignInLayout>
    );
};

export default ResetPasswordContainer;
