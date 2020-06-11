import React from 'react';
import { c } from 'ttag';
import { History } from 'history';

import { ResetPasswordForm, SupportDropdown } from '../../index';
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
            right={
                <SupportDropdown noCaret={true} className="link">
                    {c('Action').t`Need help?`}
                </SupportDropdown>
            }
        >
            <ResetPasswordForm onLogin={onLogin} />
        </SignLayout>
    );
};

export default ResetPasswordContainer;
