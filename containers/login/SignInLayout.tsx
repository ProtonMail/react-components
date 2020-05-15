import React, { ReactNode } from 'react';
import { SupportDropdown } from 'react-components';

import SignLayout from '../signup/SignLayout';

interface Props {
    children: ReactNode;
    title: string;
}

const SignInLayout = ({ children, title }: Props) => {
    return (
        <SignLayout
            title={title}
            center="TODO:ProtonLogo"
            right={<SupportDropdown className="pm-button--primaryborder-dark" />}
        >
            {children}
        </SignLayout>
    );
};

export default SignInLayout;
