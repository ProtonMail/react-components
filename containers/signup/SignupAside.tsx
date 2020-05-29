import React from 'react';

import { SignupModel } from './interfaces';
import { SIGNUP_STEPS } from './constants';
import OneAccountIllustration from '../illustration/OneAccountIllustration';

interface Props {
    model: SignupModel;
}

const { ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL } = SIGNUP_STEPS;

const SignupAside = ({ model }: Props) => {
    if ([ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL].includes(model.step)) {
        return <OneAccountIllustration />;
    }

    return null;
};

export default SignupAside;
