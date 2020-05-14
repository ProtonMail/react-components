import React from 'react';
import { c } from 'ttag';

import { SignupModel } from './interfaces';
import { SIGNUP_STEPS } from './constants';

interface Props {
    model: SignupModel;
}

const { ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL } = SIGNUP_STEPS;

const SignupAside = ({ model }: Props) => {
    if ([ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL].includes(model.step)) {
        return (
            <div className="aligncenter">
                TODO:images
                <br />
                {c('Info').t`One account for all Proton services`}
            </div>
        );
    }

    return null;
};

export default SignupAside;
