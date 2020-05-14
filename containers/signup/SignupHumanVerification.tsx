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
    };
    return (
        <>
            <div className="strong big mt0 mb1">{c('Title').t`Are you human?`}</div>
            <HumanVerificationForm
                token={model.humanVerificationToken}
                methods={model.humanVerificationMethods}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default SignupHumanVerification;
