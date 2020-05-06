import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { isEmail } from 'proton-shared/lib/helpers/validators';
import {
    Input,
    EmailInput,
    PasswordInput,
    PrimaryButton,
    Href,
    InlineLinkButton,
    Icon,
    SimpleDropdown
} from 'react-components';

import { SignupModel, SignupErros } from './interfaces';
import { SIGNUP_STEPS, UNSECURE_DOMAINS } from './constants';

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
    const loginLink = <Link key="loginLink" to="/login">{c('Link').t`Log in!`}</Link>;
    const disableSubmit = !!(
        (model.step === ACCOUNT_CREATION_USERNAME && errors.username) ||
        (model.step === ACCOUNT_CREATION_EMAIL && errors.email) ||
        errors.password ||
        errors.confirmPassword
    );
    const isUnsecure =
        isEmail(model.email) && UNSECURE_DOMAINS.some((domain: string) => model.email.toLowerCase().endsWith(domain));
    return (
        <>
            <h1 className="h2">{c('Signup title, keep "Account" capitalized').t`Create your Proton Account`}</h1>
            <form name="accountForm" className="mb2 account-form" onSubmit={onSubmit} autoComplete="off">
                {model.step === ACCOUNT_CREATION_USERNAME ? (
                    <div className="flex onmobile-flex-column mb1">
                        <label className="mr1 pm-label" htmlFor="login">{c('Signup label').t`Username`}</label>
                        <div className="flex flex-nowrap flex-items-center flex-item-fluid relative">
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
                                    placeholder={c('Placeholder').t`Username`}
                                    className="pm-field--username"
                                    required
                                />
                            </div>
                            <span className="pt0-5 italic right-icon absolute">@{availableDomain}</span>
                        </div>
                    </div>
                ) : null}
                {model.step === ACCOUNT_CREATION_EMAIL ? (
                    <div className="flex onmobile-flex-column mb1">
                        <label className="mr1 pm-label" htmlFor="login">{c('Signup label').t`Email`}</label>
                        <div className="flex-item-fluid">
                            <div className="mb1 flex flex-nowrap">
                                <div className="flex-item-fluid">
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
                                        placeholder={c('Placeholder').t`Email`}
                                        required
                                    />
                                </div>
                                {isUnsecure ? (
                                    <div className="ml1">
                                        <SimpleDropdown
                                            originalPlacement="right"
                                            hasCaret={false}
                                            content={<Icon name="warning" className="color-global-attention" />}
                                        >
                                            <div className="p1">
                                                <div className="bold mb1">{c('Title')
                                                    .t`This email may be insecure`}</div>
                                                <div>{c('Info')
                                                    .t`Google records your online activity and reads your personal data in order to provide access for advertisers and other third parties. For better privacy, create a secure email address.`}</div>
                                            </div>
                                        </SimpleDropdown>
                                    </div>
                                ) : null}
                            </div>
                            <InlineLinkButton
                                onClick={() => onChange({ ...model, email: '', step: ACCOUNT_CREATION_USERNAME })}
                            >{c('Action').t`Create a secure email address.`}</InlineLinkButton>
                        </div>
                    </div>
                ) : null}
                <div className="flex onmobile-flex-column mb1">
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
                            placeholder={c('Placeholder').t`Password`}
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
                            placeholder={c('Placeholder').t`Confirm password`}
                            error={errors.confirmPassword}
                            required
                        />
                    </div>
                </div>
                {model.step === ACCOUNT_CREATION_USERNAME ? (
                    <InlineLinkButton
                        onClick={() => onChange({ ...model, username: '', step: ACCOUNT_CREATION_EMAIL })}
                    >{c('Action').t`Use an existing email address instead.`}</InlineLinkButton>
                ) : null}
                <div className="flex flex-nowrap flex-spacebetween flex-items-center">
                    <div className="small mr1">{c('Signup info')
                        .jt`By clicking Create account, you agree to abide by ProtonMail's ${termsConditionsLink}.`}</div>
                    <PrimaryButton
                        className="pm-button--large flex-item-noshrink"
                        loading={loading}
                        disabled={disableSubmit}
                        type="submit"
                    >{c('Action').t`Create account`}</PrimaryButton>
                </div>
            </form>
            <div className="bordered-container bg-global-highlight aligncenter p1">
                <div className="bold big m0 mb0-5">{c('Info').jt`Already have an account? ${loginLink}`}</div>
                <div className="opacity-50">{c('Info')
                    .t`If you have used a Proton Service before, login with your Proton Account.`}</div>
            </div>
        </>
    );
};

export default SignupAccountForm;
