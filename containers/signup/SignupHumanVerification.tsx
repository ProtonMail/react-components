import React from 'react';
import { HumanVerificationForm } from 'react-components';
import { c } from 'ttag';

import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    onSubmit: () => void;
}

const SignupHumanVerification = ({ model, onSubmit }: Props) => {
    return (
        <>
            <h1 className="h2">{c('Title').t`Verify account`}</h1>
            <HumanVerificationForm
                token={model.humanVerificationToken}
                methods={model.humanVerificationMethods}
                onSubmit={onSubmit} />
        </>
    );
};

export default SignupHumanVerification;
