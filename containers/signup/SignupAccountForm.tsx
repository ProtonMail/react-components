import React, { useRef, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { History } from 'history';
import {
    Input,
    EmailInput,
    PasswordInput,
    PrimaryButton,
    InlineLinkButton,
    Label,
    Challenge,
    useLoading
} from 'react-components';
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
    const challengeRefLogin = useRef();
    const formRef = useRef();
    const searchParams = new URLSearchParams(history.location.search);
    const [loadingChallenge, withLoadingChallenge] = useLoading();
    const service = searchParams.get('service') as null | SERVICES;
    const [availableDomain = ''] = model.domains;
    const loginLink = <Link key="loginLink" className="nodecoration" to="/login">{c('Link').t`Sign in`}</Link>;
    const disableSubmit = !!(
        (model.step === ACCOUNT_CREATION_USERNAME && errors.username) ||
        (model.step === ACCOUNT_CREATION_EMAIL && errors.email) ||
        errors.password ||
        errors.confirmPassword
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = await challengeRefLogin.current?.getChallenge();
        payload &&
            onChange({
                ...model,
                payload: {
                    ...model.payload,
                    payload
                }
            });
        onSubmit(e);
    };

    return (
        <form
            name="accountForm"
            className="signup-form"
            onSubmit={(e) => withLoadingChallenge(handleSubmit(e))}
            autoComplete="off"
            ref={formRef}
        >
            {service && SERVICES[service] ? (
                <div className="mb1">{c('Info').t`to continue to ${SERVICES[service]}`}</div>
            ) : null}
            {model.step === ACCOUNT_CREATION_USERNAME ? (
                <div className="flex onmobile-flex-column signup-label-field-container mb1">
                    <Label htmlFor="login">{c('Signup label').t`Username`}</Label>
                    <div className="flex-item-fluid">
                        <Challenge challengeRef={challengeRefLogin} type="0">
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
                                        onKeyDown={({ keyCode }: React.KeyboardEvent<HTMLInputElement>) =>
                                            keyCode === 13 && formRef.current?.submit()
                                        }
                                        error={errors.username}
                                        placeholder={USERNAME_PLACEHOLDER}
                                        className="pm-field--username"
                                        required
                                    />
                                </div>
                                <span className="pt0-5 right-icon absolute">@{availableDomain}</span>
                            </div>
                            <InlineLinkButton
                                id="existing-email-button"
                                onClick={() => onChange({ ...model, username: '', step: ACCOUNT_CREATION_EMAIL })}
                            >{c('Action').t`Use your current email address instead`}</InlineLinkButton>
                        </Challenge>
                    </div>
                </div>
            ) : null}
            {model.step === ACCOUNT_CREATION_EMAIL ? (
                <div className="flex onmobile-flex-column signup-label-field-container mb1">
                    <Label htmlFor="login">{c('Signup label').t`Email`}</Label>
                    <div className="flex-item-fluid">
                        <Challenge challengeRef={challengeRefLogin} type="0">
                            <div className="mb0-5 flex-item-fluid">
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
                                    onKeyDown={({ keyCode }: React.KeyboardEvent<HTMLInputElement>) =>
                                        keyCode === 13 && formRef.current?.submit()
                                    }
                                    error={errors.email}
                                    required
                                />
                            </div>
                            <UnsecureEmailInfo email={model.email} />
                            <InlineLinkButton
                                id="proton-email-button"
                                onClick={() => onChange({ ...model, email: '', step: ACCOUNT_CREATION_USERNAME })}
                            >{c('Action').t`Create a secure ProtonMail address instead`}</InlineLinkButton>
                        </Challenge>
                    </div>
                </div>
            ) : null}
            <div className="flex flex-nowrap mb2">
                <div className="flex flex-item-fluid onmobile-flex-column signup-label-field-container mr0-5">
                    <Label htmlFor="password">{c('Signup label').t`Password`}</Label>
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
                <div className="flex flex-item-fluid onmobile-flex-column signup-label-field-container ml0-5">
                    <Label htmlFor="password-repeat">{c('Signup label').t`Confirm`}</Label>
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
            </div>
            <div className="alignright mb2">
                <PrimaryButton
                    className="pm-button--large flex-item-noshrink onmobile-w100"
                    loading={loading || loadingChallenge}
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
