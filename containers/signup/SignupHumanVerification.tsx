import React from 'react';

import { HumanVerificationForm } from '../../index';
import { SignupModel } from './interfaces';
import { MethodType } from '../api/HumanVerificationForm';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (model: SignupModel) => void;
}

const SignupHumanVerification = ({ model, onChange, onSubmit }: Props) => {
    const handleSubmit = (token: string, tokenType: MethodType) => {
        const newModel = {
            ...model,
            verificationToken: token,
            verificationTokenType: tokenType
        };
        onChange(newModel);
        onSubmit(newModel);
    };
    return (
        <HumanVerificationForm
            token={model.humanVerificationToken}
            methods={model.humanVerificationMethods}
            onSubmit={handleSubmit}
        />
    );
};

export default SignupHumanVerification;
