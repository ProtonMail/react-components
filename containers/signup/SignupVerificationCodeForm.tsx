import React, { ChangeEvent, FormEvent } from 'react';
import { c } from 'ttag';
import { VerificationCodeInput, InlineLinkButton, Alert } from 'react-components';

import { SignupModel, SignupErros } from './interfaces';
import { PrimaryButton } from '../../components/button';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onResend: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    errors: SignupErros;
    loading: boolean;
}

const SignupVerificationCodeForm = ({ model, onChange, onSubmit, onResend, errors, loading }: Props) => {
    const disableSubmit = !!errors.verificationCode;
    const destinationBold = <strong key="destination">{model.email}</strong>;
    return (
        <form name="humanForm" onSubmit={onSubmit}>
            <div className="strong mb1">{c('Title').t`Human verification`}</div>
            <Alert>{c('Info').t`For security reasons, please verify that your are not a robot.`}</Alert>
            <label htmlFor="verification-code">{c('Label')
                .jt`Enter the verification code that was sent to ${destinationBold}. If you don't find the email in your inbox, please check your spam folder`}</label>
            <div className="mb1">
                <VerificationCodeInput
                    id="verification-code"
                    className="mb1"
                    value={model.verificationCode}
                    error={errors.verificationCode}
                    onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                        onChange({ ...model, verificationCode: target.value })
                    }
                    autoFocus
                    required
                />
            </div>
            <div className="mb1">
                <InlineLinkButton disabled={loading} onClick={onResend}>{c('Action')
                    .t`Did not receive the code?`}</InlineLinkButton>
            </div>
            <div className="alignright">
                <PrimaryButton className="pm-button--large" type="submit" disabled={disableSubmit} loading={loading}>{c(
                    'Action'
                ).t`Verify`}</PrimaryButton>
            </div>
        </form>
    );
};

export default SignupVerificationCodeForm;
