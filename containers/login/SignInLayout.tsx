import React, { ReactNode } from 'react';
import { SupportDropdown } from 'react-components';
import { Locales } from 'proton-shared/lib/interfaces/Locales';

import SignLayout from '../signup/SignLayout';

interface Props {
    children: ReactNode;
    title: string;
    locales: Locales;
}

const SignInLayout = ({ children, title, locales }: Props) => {
    return (
        <SignLayout
            locales={locales}
            title={title}
            center="TODO:ProtonLogo"
            right={<SupportDropdown className="pm-button--primaryborder-dark" />}
        >
            {children}
        </SignLayout>
    );
};

export default SignInLayout;
