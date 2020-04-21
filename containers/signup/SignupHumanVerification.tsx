import React from 'react';
import { HumanVerificationForm } from 'react-components';
import { c } from 'ttag';

import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: () => void;
}

const SignupHumanVerification = ({ model, onChange, onSubmit }: Props) => {
    const handleSubmit = (token: string, tokenType: string) => {
        onChange({
            ...model,
            verificationToken: token,
            verificationTokenType: tokenType
        });
        onSubmit();
    }
    return (
        <>
            <h1 className="h2">{c('Title').t`Verify account`}</h1>
            <HumanVerificationForm
                token={model.humanVerificationToken}
                methods={model.humanVerificationMethods}
                onSubmit={handleSubmit} />
        </>
    );
};

export default SignupHumanVerification;
