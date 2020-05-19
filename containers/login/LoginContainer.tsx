import React from 'react';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';
import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';

interface Props {
    onLogin: () => void;
}

const LoginContainer = ({ onLogin }: Props) => {
    const signupLink = <Link key="signupLink" to="/signup">{c('Link').t`Create an account`}</Link>;
    return (
        <SignLayout
            title={c('Title').t`Sign in`}
            center={<ProtonLogo />}
            aside={
                <div className="aligncenter">
                    TODO:images
                    <br />
                    {c('Info').t`One account for all Proton services`}
                </div>
            }
        >
            <LoginForm onLogin={onLogin} />
            <div className="mb2 alignright">{c('Info').jt`New to Proton? ${signupLink}`}</div>
        </SignLayout>
    );
};

export default LoginContainer;
