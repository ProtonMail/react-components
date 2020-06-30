import React, { FunctionComponent } from 'react';
import { c } from 'ttag';
import { History } from 'history';

import { ResetPasswordForm } from '../../index';
import { Props as SignLayoutProps } from '../signup/SignLayout';
import BackButton from '../signup/BackButton';

interface Props {
    onLogin: () => void;
    history: History;
    WrapSignLayout: FunctionComponent<SignLayoutProps>;
}

const ResetPasswordContainer = ({ onLogin, history, WrapSignLayout }: Props) => {
    const handleBack = () => {
        history.push('/login');
    };
    return (
        <WrapSignLayout title={c('Title').t`Reset password`} left={<BackButton onClick={handleBack} />}>
            <ResetPasswordForm onLogin={onLogin} />
        </WrapSignLayout>
    );
};

export default ResetPasswordContainer;
