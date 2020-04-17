import React, { ChangeEvent, FormEvent } from 'react';
import { c } from 'ttag';
import { Alert, EmailInput, LinkButton, PrimaryButton, IntlTelInput } from 'react-components';

import { SignupModel, SignupErros } from './interfaces';
import { SIGNUP_STEPS } from './constants';
import InlineLinkButton from '../../components/button/InlineLinkButton';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    errors: SignupErros;
    loading: boolean;
}

const { RECOVERY_EMAIL, RECOVERY_PHONE, PLANS } = SIGNUP_STEPS;

const SignupRecoveryForm = ({ model, onChange, onSubmit, errors, loading }: Props) => {
    const disableSubmit = model.step === RECOVERY_EMAIL ? !!errors.recoveryEmail : !!errors.recoveryPhone;
    const handleChangePhone = (status: any, value: any, countryData: any, number: string) => {
        onChange({ ...model, recoveryPhone: number });
    };
    return (
        <>
            <h1 className="h2">{c('Title').t`Add recovery method (recommended)`}</h1>
            <form name="recoveryForm" onSubmit={onSubmit}>
                <Alert>{c('Info')
                    .t`Add a recovery email or phone number so that you can recover your account if you get locked out or forget your password.`}</Alert>
                {model.step === RECOVERY_EMAIL ? (
                    <div className="mb1">
                        <label className="bl mb0-5" htmlFor="recovery-email">{c('Label').t`Email`}</label>
                        <div className="mb1">
                            <EmailInput
                                id="recovery-email"
                                name="recovery-email"
                                autoFocus
                                autoComplete="on"
                                autoCapitalize="off"
                                autoCorrect="off"
                                value={model.recoveryEmail}
                                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                    onChange({ ...model, recoveryEmail: target.value })
                                }
                                placeholder={c('Placeholder').t`user@domain.com`}
                                required
                            />
                        </div>
                        <InlineLinkButton
                            onClick={() => onChange({ ...model, recoveryEmail: '', step: RECOVERY_PHONE })}
                        >{c('Action').t`Enter recovery phone instead.`}</InlineLinkButton>
                    </div>
                ) : null}
                {model.step === RECOVERY_PHONE ? (
                    <div className="mb1">
                        <label className="bl mb0-5" htmlFor="recovery-phone">{c('Label').t`Phone`}</label>
                        <div className="mb1">
                            <IntlTelInput
                                id="recovery-phone"
                                name="recovery-phone"
                                containerClassName="w100"
                                inputClassName="w100"
                                autoFocus
                                onPhoneNumberChange={handleChangePhone}
                                onPhoneNumberBlur={handleChangePhone}
                                required
                            />
                        </div>
                        <InlineLinkButton
                            onClick={() => onChange({ ...model, recoveryPhone: '', step: RECOVERY_EMAIL })}
                        >{c('Action').t`Enter recovery email address instead.`}</InlineLinkButton>
                    </div>
                ) : null}
                <div className="alignright mb1">
                    <LinkButton
                        className="mr1 pm-button--large"
                        disabled={loading}
                        onClick={() => onChange({ ...model, step: PLANS })}
                    >{c('Action').t`Skip`}</LinkButton>
                    <PrimaryButton
                        className="pm-button--large"
                        loading={loading}
                        disabled={disableSubmit}
                        type="submit"
                    >{c('Action').t`Next`}</PrimaryButton>
                </div>
            </form>
            <Alert>
                <div className="mb1">{c('Info')
                    .t`Your email or number is not shared with third parties and is only used for recovery and account-related communications.`}</div>
                <div>{c('Info').t`You will need to confirm later that this email or phone number belongs to you.`}</div>
            </Alert>
        </>
    );
};

export default SignupRecoveryForm;
