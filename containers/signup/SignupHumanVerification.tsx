import React, { FormEvent } from 'react';
import { Alert } from 'react-components';
import { c } from 'ttag';

import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

const SignupHumanVerification = ({ model, onChange, onSubmit, loading }: Props) => {
    return (
        <>
            <h1 className="h2">{c('Title').t`Verify account`}</h1>
            <Alert>{c('Info').t`For security reasons, please verify that your are not a robot.`}</Alert>
            <form name="humanForm" onSubmit={onSubmit}></form>
        </>
    );
};

export default SignupHumanVerification;
