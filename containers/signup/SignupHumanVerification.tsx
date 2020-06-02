import React from 'react';
import { HumanVerificationForm } from 'react-components';
import { TOKEN_TYPES } from 'proton-shared/lib/constants';

import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: () => void;
}

const SignupHumanVerification = ({ model, onChange, onSubmit }: Props) => {
    const handleSubmit = (token: string, tokenType: TOKEN_TYPES) => {
        onChange({
            ...model,
            verificationToken: token,
            verificationTokenType: tokenType
        });
        onSubmit();
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
