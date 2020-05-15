import React from 'react';
import { c } from 'ttag';
import { Locales } from 'proton-shared/lib/interfaces/Locales';
import { ResetPasswordForm } from 'react-components';

import SignInLayout from './SignInLayout';

interface Props {
    onLogin: () => void;
    locales: Locales;
}

const ResetPasswordContainer = ({ onLogin, locales }: Props) => {
    return (
        <SignInLayout title={c('Title').t`Reset password`} locales={locales}>
            <ResetPasswordForm onLogin={onLogin} />
        </SignInLayout>
    );
};

export default ResetPasswordContainer;
