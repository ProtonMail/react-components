import React from 'react';
import { c } from 'ttag';

import LoginForm from './LoginForm';
import SignLayout from '../signup/SignLayout';

interface Props {
    onLogin: () => void;
}

const LoginContainer = ({ onLogin }: Props) => {
    return (
        <SignLayout
            title={c('Title').t`Sign in`}
            center="TODO:ProtonLogo"
            aside={
                <div className="aligncenter">
                    TODO:images
                    <br />
                    {c('Info').t`One account for all Proton services`}
                </div>
            }
        >
            <LoginForm onLogin={onLogin} />
        </SignLayout>
    );
};

export default LoginContainer;
