import React, { ReactNode } from 'react';
import { c } from 'ttag';
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
            right={
                <SupportDropdown noCaret={true} className="link" content={c('Action').t`Need help?`}>{c('Action')
                    .t`Need help?`}</SupportDropdown>
            }
        >
            {children}
        </SignLayout>
    );
};

export default SignInLayout;
