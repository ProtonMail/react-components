import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { History } from 'history';
import { Input, EmailInput, PasswordInput, PrimaryButton, InlineLinkButton } from 'react-components';
import { USERNAME_PLACEHOLDER } from 'proton-shared/lib/constants';

import { SignupModel, SignupErros } from './interfaces';
import { SIGNUP_STEPS } from './constants';
import UnsecureEmailInfo from './UnsecureEmailInfo';

interface Props {
    history: History;
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    errors: SignupErros;
    loading: boolean;
}

const { ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL } = SIGNUP_STEPS;

enum SERVICES {
    mail = 'ProtonMail',
    calendar = 'ProtonCalendar',
    contacts = 'ProtonContacts',
    drive = 'ProtonDrive',
    vpn = 'ProtonVPN'
}

const SignupAccountForm = ({ history, model, onChange, onSubmit, errors, loading }: Props) => {
    const searchParams = new URLSearchParams(history.location.search);
    const service = searchParams.get('service') as null | SERVICES;
    const [availableDomain = ''] = model.domains;
    const loginLink = <Link key="loginLink" to="/login">{c('Link').t`Sign in`}</Link>;
    const disableSubmit = !!(
        (model.step === ACCOUNT_CREATION_USERNAME && errors.username) ||
        (model.step === ACCOUNT_CREATION_EMAIL && errors.email) ||
        errors.password ||
        errors.confirmPassword
    );

    return (
        <form name="accountForm" className="signup-form" onSubmit={onSubmit} autoComplete="off">
            <div className="strong big mt0 mb1">{c('Signup title, keep "Account" capitalized')
                .t`Create your Proton Account`}</div>
            {service && SERVICES[service] ? (
                <div className="mb1">{c('Info').t`to continue to ${SERVICES[service]}`}</div>
            ) : null}
            {model.step === ACCOUNT_CREATION_USERNAME ? (
                <div className="flex onmobile-flex-column mb1">
                    <label className="mr1 pm-label" htmlFor="login">{c('Signup label').t`Username`}</label>
                    <div className="flex-item-fluid">
                        <div className="flex flex-nowrap flex-items-center flex-item-fluid relative mb0-5">
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
            <div className="flex onmobile-flex-column mb2">
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
            <div className="alignright mb1">
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
    );
};

export default SignupAccountForm;
