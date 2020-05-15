import React from 'react';
import { c } from 'ttag';
import { Locales } from 'proton-shared/lib/interfaces/Locales';

import LoginForm from './LoginForm';
import SignLayout from '../signup/SignLayout';

interface Props {
    onLogin: () => void;
    locales: Locales;
}

const LoginContainer = ({ locales, onLogin }: Props) => {
    return (
        <SignLayout
            title={c('Title').t`Sign in`}
            center="TODO:ProtonLogo"
            locales={locales}
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
