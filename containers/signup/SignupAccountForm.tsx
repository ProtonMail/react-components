import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { Input, EmailInput, PasswordInput, PrimaryButton, Href, InlineLinkButton } from 'react-components';
import { USERNAME_PLACEHOLDER } from 'proton-shared/lib/constants';

import { SignupModel, SignupErros } from './interfaces';
import { SIGNUP_STEPS } from './constants';
import UnsecureEmailInfo from './UnsecureEmailInfo';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    errors: SignupErros;
    loading: boolean;
}

const { ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL } = SIGNUP_STEPS;

const SignupAccountForm = ({ model, onChange, onSubmit, errors, loading }: Props) => {
    const [availableDomain = ''] = model.domains;
    const termsConditionsLink = (
        <Href url="https://protonmail.com/terms-and-conditions" key="terms">{c('Signup link')
            .t`terms and conditions`}</Href>
    );
    const loginLink = <Link key="loginLink" to="/login">{c('Link').t`Sign in`}</Link>;
    const disableSubmit = !!(
        (model.step === ACCOUNT_CREATION_USERNAME && errors.username) ||
        (model.step === ACCOUNT_CREATION_EMAIL && errors.email) ||
        errors.password ||
        errors.confirmPassword
    );

    return (
        <>
            <form name="accountForm" className="pl2 pr2 mb1 signup-form" onSubmit={onSubmit} autoComplete="off">
                <div className="strong big mt0 mb1">{c('Signup title, keep "Account" capitalized')
                    .t`Create your Proton Account`}</div>
                {model.step === ACCOUNT_CREATION_USERNAME ? (
                    <div className="flex onmobile-flex-column mb1">
                        <label className="mr1 pm-label" htmlFor="login">{c('Signup label').t`Username`}</label>
                        <div className="flex-item-fluid">
                            <div className="flex flex-nowrap flex-items-center flex-item-fluid relative mb1">
                                <div className="flex-item-fluid">
                                    <Input
                                        id="login"
                                        name="login"
                                        autoFocus
                                        autoComplete="off"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        value={model.username}
                                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                            onChange({ ...model, username: target.value })
                                        }
                                        error={errors.username}
                                        placeholder={USERNAME_PLACEHOLDER}
                                        className="pm-field--username"
                                        required
                                    />
                                </div>
                                <span className="pt0-5 italic right-icon absolute">@{availableDomain}</span>
                            </div>
                            <InlineLinkButton
                                onClick={() => onChange({ ...model, username: '', step: ACCOUNT_CREATION_EMAIL })}
                            >{c('Action').t`Use an existing email address instead`}</InlineLinkButton>
                        </div>
                    </div>
                ) : null}
                {model.step === ACCOUNT_CREATION_EMAIL ? (
                    <div className="flex onmobile-flex-column mb1">
                        <label className="mr1 pm-label" htmlFor="login">{c('Signup label').t`Email`}</label>
                        <div className="flex-item-fluid">
                            <div className="mb1 flex-item-fluid">
                                <EmailInput
                                    id="login"
                                    name="login"
                                    autoFocus
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                    value={model.email}
                                    onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                        onChange({ ...model, email: target.value })
                                    }
                                    error={errors.email}
                                    required
                                />
                            </div>
                            <UnsecureEmailInfo email={model.email} />
                            <InlineLinkButton
                                onClick={() => onChange({ ...model, email: '', step: ACCOUNT_CREATION_USERNAME })}
                            >{c('Action').t`Create a secure email address`}</InlineLinkButton>
                        </div>
                    </div>
                ) : null}
                <div className="flex onmobile-flex-column mb0-5">
                    <label className="mr1 pm-label" htmlFor="password">{c('Signup label').t`Password`}</label>
                    <div className="flex-item-fluid">
                        <PasswordInput
                            id="password"
                            name="password"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            value={model.password}
                            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                onChange({ ...model, password: target.value })
                            }
                            error={errors.password}
                            required
                        />
                    </div>
                </div>
                <div className="flex onmobile-flex-column mb1">
                    <label className="mr1 pm-label" htmlFor="password-repeat">{c('Signup label')
                        .t`Confirm password`}</label>
                    <div className="flex-item-fluid">
                        <PasswordInput
                            id="password-repeat"
                            name="password-repeat"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            value={model.confirmPassword}
                            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                onChange({ ...model, confirmPassword: target.value })
                            }
                            error={errors.confirmPassword}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-nowrap flex-spacebetween flex-items-center mb1">
                    <div className="small mr1">{c('Signup info')
                        .jt`By clicking Create account, you agree to abide by ProtonMail's ${termsConditionsLink}.`}</div>
                    <PrimaryButton
                        className="pm-button--large flex-item-noshrink"
                        loading={loading}
                        disabled={disableSubmit}
                        type="submit"
                    >{c('Action').t`Create account`}</PrimaryButton>
                </div>
                <div className="alignright">
                    <span>{c('Info').jt`Already have an account? ${loginLink}`}</span>
                </div>
            </form>
        </>
    );
};

export default SignupAccountForm;
