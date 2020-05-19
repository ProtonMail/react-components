import React, { ReactNode } from 'react';
import { SupportDropdown } from 'react-components';

import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';

interface Props {
    children: ReactNode;
    title: string;
}

const SignInLayout = ({ children, title }: Props) => {
    return (
        <SignLayout
            title={title}
            center={<ProtonLogo />}
            right={<SupportDropdown className="pm-button--primaryborder-dark" />}
        >
            {children}
        </SignLayout>
    );
};

export default SignInLayout;
