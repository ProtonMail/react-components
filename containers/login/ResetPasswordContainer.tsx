import React from 'react';
import { c } from 'ttag';
import { ResetPasswordForm, Icon, SupportDropdown } from 'react-components';

import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';

interface Props {
    onLogin: () => void;
}

const handleBack = () => {
    history.goBack();
};

const ResetPasswordContainer = ({ onLogin }: Props) => {
    return (
        <SignLayout
            title={c('Title').t`Reset password`}
            left={
                <button type="button" onClick={handleBack} title={c('Action').t`Back`}>
                    <Icon name="arrow-left" />
                    <span className="sr-only">{c('Action').t`Back`}</span>
                </button>
            }
            center={<ProtonLogo />}
            right={<SupportDropdown className="link" content={c('Action').t`Need help?`} />}
        >
            <ResetPasswordForm onLogin={onLogin} />
        </SignLayout>
    );
};

export default ResetPasswordContainer;
