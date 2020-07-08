import React, { FunctionComponent } from 'react';
import { c } from 'ttag';
import { History } from 'history';

import { ResetPasswordForm } from '../../index';
import { Props as AccountLayoutProps } from '../signup/AccountPublicLayout';
import BackButton from '../signup/BackButton';

interface Props {
    onLogin: () => void;
    history: History;
    Layout: FunctionComponent<AccountLayoutProps>;
}

const ResetPasswordContainer = ({ onLogin, history, Layout }: Props) => {
    const handleBack = () => {
        history.push('/login');
    };
    return (
        <Layout title={c('Title').t`Reset password`} left={<BackButton onClick={handleBack} />}>
            <ResetPasswordForm onLogin={onLogin} />
        </Layout>
    );
};

export default ResetPasswordContainer;
