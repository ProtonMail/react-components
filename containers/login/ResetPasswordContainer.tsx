import React from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { ResetPasswordForm, SupportDropdown } from 'react-components';

import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';
import BackButton from '../signup/BackButton';

interface Props {
    onLogin: () => void;
    history: History;
}

const ResetPasswordContainer = ({ onLogin, history }: Props) => {
    const handleBack = () => {
        history.push('/login');
    };

    return (
        <SignLayout
            title={c('Title').t`Reset password`}
            left={<BackButton onClick={handleBack} />}
            center={<ProtonLogo />}
            right={<SupportDropdown className="link" content={c('Action').t`Need help?`} />}
        >
            <ResetPasswordForm onLogin={onLogin} />
        </SignLayout>
    );
};

export default ResetPasswordContainer;
