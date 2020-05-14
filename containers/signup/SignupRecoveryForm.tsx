import React, { ChangeEvent, FormEvent } from 'react';
import { c } from 'ttag';
import { Alert, EmailInput, LinkButton, PrimaryButton, IntlTelInput, useModals, ConfirmModal } from 'react-components';

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
    const { createModal } = useModals();
    const disableSubmit = model.step === RECOVERY_EMAIL ? !!errors.recoveryEmail : !!errors.recoveryPhone;
    const handleChangePhone = (status: any, value: any, countryData: any, number: string) => {
        onChange({ ...model, recoveryPhone: number });
    };
    const handleSkip = async () => {
        await new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal title={c('Title').t`Warning`} onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Info')
                        .t`You did not set a recovery email so account recovery is impossible if you forget your password. Proceed without recovery email?`}</Alert>
                </ConfirmModal>
            );
        });
        onChange({ ...model, step: PLANS });
    };
    return (
        <form name="recoveryForm" className="pl2 pr2 pb1 signup-form" onSubmit={onSubmit}>
            <div className="strong big mt0 mb1">{c('Title').t`Add a recovery email (highly recommended)`}</div>
            <p>{c('Info')
                .t`Proton will send you a recovery link to this email address if you forget your password or get locked out of your account.`}</p>
            {model.step === RECOVERY_EMAIL ? (
                <>
                    <div className="flex onmobile-flex-column mb1">
                        <label className="pm-label" htmlFor="recovery-email">{c('Label').t`Recovery email`}</label>
                        <div className="flex-item-fluid">
                            <div className="mb0-5">
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
                                    required
                                />
                            </div>
                            <div>
                                <InlineLinkButton
                                    onClick={() => onChange({ ...model, recoveryEmail: '', step: RECOVERY_PHONE })}
                                >{c('Action').t`Add a recovery phone number instead`}</InlineLinkButton>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            {model.step === RECOVERY_PHONE ? (
                <>
                    <div className="flex onmobile-flex-column mb1">
                        <label className="pm-label" htmlFor="recovery-phone">{c('Label').t`Recovery phone`}</label>
                        <div className="flex-item-fluid">
                            <div className="mb0-5">
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
                            <div>
                                <InlineLinkButton
                                    onClick={() => onChange({ ...model, recoveryPhone: '', step: RECOVERY_EMAIL })}
                                >{c('Action').t`Add an email address instead`}</InlineLinkButton>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            <div className="alignright mb1">
                <LinkButton className="mr1 pm-button--large mr2" disabled={loading} onClick={handleSkip}>{c('Action')
                    .t`Skip`}</LinkButton>
                <PrimaryButton className="pm-button--large" loading={loading} disabled={disableSubmit} type="submit">{c(
                    'Action'
                ).t`Next`}</PrimaryButton>
            </div>
        </form>
    );
};

export default SignupRecoveryForm;
