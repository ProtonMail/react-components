import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { Location, History } from 'history';
import { useApi, useLoading, useConfig, usePlans } from 'react-components';
import { queryAvailableDomains } from 'proton-shared/lib/api/domains';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import { checkSubscription } from 'proton-shared/lib/api/payments';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import {
    queryCheckUsernameAvailability,
    queryCreateUser,
    queryDirectSignupStatus,
    queryVerificationCode,
    queryCheckVerificationCode
} from 'proton-shared/lib/api/user';

import { isEmail } from 'proton-shared/lib/helpers/validators';
import { c } from 'ttag';

import SignupLayout from './SignupLayout';
import SignupAside from './SignupAside';
import SignupAccountForm from './SignupAccountForm';
import SignupRecoveryForm from './SignupRecoveryForm';
import SignupVerificationCodeForm from './SignupVerificationCodeForm';
import SignupHumanVerification from './SignupHumanVerification';
import SignupPlans from './SignupPlans';
import { SignupModel, SignupErros, PlanIDs, SubscriptionCheckResult } from './interfaces';
import { DEFAULT_SIGNUP_MODEL, DEFAULT_CHECK_RESULT, SIGNUP_STEPS } from './constants';

interface Props {
    history: History;
    location: Location;
    onLogin: () => void;
}

const {
    ACCOUNT_CREATION_USERNAME,
    ACCOUNT_CREATION_EMAIL,
    NO_SIGNUP,
    RECOVERY_EMAIL,
    RECOVERY_PHONE,
    VERIFICATION_CODE,
    PLANS,
    PAYMENT,
    HUMAN_VERIFICATION
} = SIGNUP_STEPS;

const SignupContainer = ({ onLogin, location, history }: Props) => {
    const api = useApi();
    const { CLIENT_TYPE } = useConfig();
    const [plans, loadingPlans] = usePlans();
    const [loading, withLoading] = useLoading();
    const [model, updateModel] = useState<SignupModel>(DEFAULT_SIGNUP_MODEL);
    const [checkResult, setCheckResult] = useState<SubscriptionCheckResult>(DEFAULT_CHECK_RESULT);
    const [usernameError, setUsernameError] = useState<string>('');
    const hasFreePlan = !Object.keys(model.planIDs).length;

    const errors = useMemo<SignupErros>(() => {
        return {
            username: !model.username ? c('Signup error').t`This field is required` : usernameError,
            email: model.email
                ? isEmail(model.email)
                    ? ''
                    : c('Signup error').t`Email address invalid`
                : c('Signup error').t`This field is required`,
            password: model.password ? '' : c('Signup error').t`This field is required`,
            confirmPassword: model.confirmPassword
                ? model.password !== model.confirmPassword
                    ? c('Signup error').t`Password do not match`
                    : ''
                : c('Signup error').t`This field is required`,
            recoveryEmail: model.recoveryEmail
                ? isEmail(model.recoveryEmail)
                    ? ''
                    : c('Signup error').t`Email address invalid`
                : c('Signup error').t`This field is required`,
            recoveryPhone: model.recoveryPhone ? '' : c('Signup error').t`This field is required`,
            verificationCode: model.verificationCode ? '' : c('Signup error').t`This field is required`
        };
    }, [
        usernameError,
        model.username,
        model.email,
        model.password,
        model.confirmPassword,
        model.recoveryEmail,
        model.recoveryPhone,
        model.verificationCode
    ]);

    const goToStep = (step: string) => updateModel({ ...model, step });
    const handleBack = () => {
        let backStep;
        switch (model.step) {
            case ACCOUNT_CREATION_USERNAME:
            case ACCOUNT_CREATION_EMAIL:
                history.goBack();
                break;
            case RECOVERY_EMAIL:
            case RECOVERY_PHONE:
                backStep = ACCOUNT_CREATION_USERNAME;
                break;
            case VERIFICATION_CODE:
                backStep = ACCOUNT_CREATION_EMAIL;
                break;
            case PLANS:
                if (model.username && model.recoveryEmail) {
                    backStep = RECOVERY_EMAIL;
                } else if (model.username && model.recoveryPhone) {
                    backStep = RECOVERY_PHONE;
                } else if (model.email) {
                    backStep = VERIFICATION_CODE;
                }
                break;
        }
        if (backStep) {
            goToStep(backStep);
        }
    };

    const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        if (model.step === ACCOUNT_CREATION_USERNAME) {
            try {
                await api(queryCheckUsernameAvailability(model.username));
                goToStep(RECOVERY_EMAIL);
            } catch (error) {
                setUsernameError(error.data ? error.data.Error : c('Error').t`Can't check username, try again later`);
            }
            return;
        }

        if (model.step === ACCOUNT_CREATION_EMAIL) {
            await api(queryVerificationCode('email', { Address: model.email }));
            goToStep(VERIFICATION_CODE);
            return;
        }

        if (model.step === RECOVERY_EMAIL) {
            goToStep(PLANS);
            return;
        }

        if (model.step === RECOVERY_PHONE) {
            goToStep(PLANS);
            return;
        }

        if (model.step === VERIFICATION_CODE) {
            await api(queryCheckVerificationCode(`${model.email}:${model.verificationCode}`, 'email', CLIENT_TYPE));
            goToStep(PLANS);
            return;
        }

        if (model.step === PLANS || model.step === HUMAN_VERIFICATION) {
            if (hasFreePlan) {
                if (model.username) {
                    try {
                        const { password, recoveryEmail, username } = model;
                        await srpVerify({
                            api,
                            credentials: { password },
                            config: queryCreateUser({
                                Type: CLIENT_TYPE,
                                Email: recoveryEmail,
                                Username: username
                            })
                        });
                    } catch (error) {
                        updateModel({
                            ...model,
                            humanVerificationMethods: [],
                            humanVerificationToken: '',
                            step: HUMAN_VERIFICATION
                        });
                        return;
                    }
                } else if (model.email) {
                    // TODO
                }
            } else {
                goToStep(PAYMENT);
                return;
            }
            await onLogin();
            return;
        }
    };

    const handleChangePlanIDs = async (planIDs: PlanIDs) => {
        if (Object.keys(planIDs).length) {
            const result = await api(
                checkSubscription({
                    PlanIDs: planIDs,
                    Currency: model.currency,
                    Cycle: model.cycle
                })
            );
            setCheckResult(result);
            updateModel({ ...model, planIDs });
        } else {
            setCheckResult(DEFAULT_CHECK_RESULT);
            updateModel({ ...model, planIDs });
        }
    };

    const handleResend = async () => {
        await api(queryVerificationCode('email', { Address: model.email }));
    };

    const fetchDependencies = async () => {
        try {
            const { Direct, VerifyMethods: verifyMethods } = await api(queryDirectSignupStatus());

            if (!Direct) {
                // We block the signup from API demand
                throw new Error('No signup');
            }

            const { Domains: domains } = await api(queryAvailableDomains());
            updateModel({ ...model, step: ACCOUNT_CREATION_USERNAME, verifyMethods, domains });
        } catch (error) {
            return goToStep(NO_SIGNUP);
        }
    };

    useEffect(() => {
        withLoading(fetchDependencies());
    }, []);

    useEffect(() => {
        if (usernameError) {
            setUsernameError('');
        }
    }, [model.username]);

    return (
        <SignupLayout model={model} onBack={handleBack} aside={<SignupAside model={model} errors={errors} />}>
            {model.step === NO_SIGNUP && 'TODO'}
            {model.step === ACCOUNT_CREATION_USERNAME && (
                <SignupAccountForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => withLoading(handleSubmit(e))}
                    loading={loading}
                />
            )}
            {model.step === ACCOUNT_CREATION_EMAIL && (
                <SignupAccountForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => withLoading(handleSubmit(e))}
                    loading={loading}
                />
            )}
            {model.step === RECOVERY_EMAIL && (
                <SignupRecoveryForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => withLoading(handleSubmit(e))}
                    loading={loading}
                />
            )}
            {model.step === RECOVERY_PHONE && (
                <SignupRecoveryForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => withLoading(handleSubmit(e))}
                    loading={loading}
                />
            )}
            {model.step === VERIFICATION_CODE && (
                <SignupVerificationCodeForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => withLoading(handleSubmit(e))}
                    onResend={() => withLoading(handleResend())}
                    loading={loading}
                />
            )}
            {model.step === PLANS && (
                <SignupPlans
                    plans={plans}
                    model={model}
                    onChange={updateModel}
                    onSubmit={() => withLoading(handleSubmit())}
                    loading={loading || loadingPlans}
                />
            )}
            {model.step === HUMAN_VERIFICATION && (
                <SignupHumanVerification
                    model={model}
                    onSubmit={handleSubmit}
                />
            )}
        </SignupLayout>
    );
};

export default SignupContainer;
