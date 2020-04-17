import React from 'react';

import { SignupModel, SignupErros } from './interfaces';

interface Props {
    model: SignupModel;
    errors: SignupErros;
}

const SignupAside = ({ model, errors }: Props) => {
    return (
        <div className="p2">
            <h1>SignupAside component</h1>
            <pre className="mb2">{JSON.stringify(model)}</pre>
            <pre>{JSON.stringify(errors)}</pre>
        </div>
    );
};

export default SignupAside;
