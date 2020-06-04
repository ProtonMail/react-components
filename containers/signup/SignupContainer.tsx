import React, { useState, useEffect, useMemo } from 'react';
import { History } from 'history';
import { useApi, useLoading, useConfig, usePlans, useModals, usePayment, SupportDropdown } from 'react-components';
import ProtonLogo from '../../components/logo/ProtonLogo';
import { queryAvailableDomains } from 'proton-shared/lib/api/domains';
import { setupAddress } from 'proton-shared/lib/api/addresses';
import { setupKeys } from 'proton-shared/lib/api/keys';
import { queryAddresses } from 'proton-shared/lib/api/addresses';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import { TOKEN_TYPES, DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS } from 'proton-shared/lib/constants';
import { subscribe, checkSubscription } from 'proton-shared/lib/api/payments';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { generateKeySaltAndPassphrase } from 'proton-shared/lib/keys/keys';
import { getResetAddressesKeys } from 'proton-shared/lib/keys/resetKeys';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { isEmail } from 'proton-shared/lib/helpers/validators';
import { Address } from 'proton-shared/lib/interfaces/Address';
import { c } from 'ttag';
import {
    queryCheckUsernameAvailability,
    queryCreateUser,
    queryCreateUserExternal,
    queryDirectSignupStatus,
    queryVerificationCode,
    queryCheckVerificationCode
} from 'proton-shared/lib/api/user';

import SignLayout from './SignLayout';
import SignupAside from './SignupAside';
import SignupAccountForm from './SignupAccountForm';
import SignupRecoveryForm from './SignupRecoveryForm';
import SignupVerificationCodeForm from './SignupVerificationCodeForm';
import SignupHumanVerification from './SignupHumanVerification';
import SignupPlans from './SignupPlans';
import SignupPayment from './SignupPayment';
import SignupComplete from './SignupComplete';
import SignupCreatingAccount from './SignupCreatingAccount';
import NoSignup from './NoSignup';
import { handlePaymentToken } from '../payments/paymentTokenHelper';
import InvalidVerificationCodeModal from '../api/InvalidVerificationCodeModal';
import { SignupModel, SignupErros, SignupPlan, SubscriptionCheckResult } from './interfaces';
import { DEFAULT_SIGNUP_MODEL, DEFAULT_CHECK_RESULT, SIGNUP_STEPS } from './constants';
import humanApiHelper from './humanApi';
import BackButton from './BackButton';
import RequestNewCodeModal from '../api/RequestNewCodeModal';

interface Props {
    history: History;
    onLogin: (data: { UID: string; EventID: string }) => void;
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
    HUMAN_VERIFICATION,
    CREATING_ACCOUNT,
    COMPLETE
} = SIGNUP_STEPS;

const withAuthHeaders = (UID: string, AccessToken: string, config: any) =>
    mergeHeaders(config, getAuthHeaders(UID, AccessToken));

const SignupContainer = ({ onLogin, history }: Props) => {
    const searchParams = new URLSearchParams(history.location.search);
    const currency = searchParams.get('currency');
    const cycle = Number(searchParams.get('billing'));
    const preSelectedPlan = searchParams.get('plan');
    const api = useApi();
    const { createModal } = useModals();
    const { CLIENT_TYPE } = useConfig();
    const [plans, loadingPlans] = usePlans();
    const [loading, withLoading] = useLoading();
    const [checkResult, setCheckResult] = useState<SubscriptionCheckResult>(DEFAULT_CHECK_RESULT);
    const [model, updateModel] = useState<SignupModel>({
        ...DEFAULT_SIGNUP_MODEL,
        ...(currency ? { currency } : {}),
        ...(cycle ? { cycle } : {})
        // NOTE preSelectedPlan is used in a useEffect
    });
    const [usernameError, setUsernameError] = useState<string>('');
    const hasPaidPlan = ({ planIDs = {} } = {}) => !!Object.keys(planIDs).length;

    const handlePayPal = () => {
        // TODO
    };

    const {
        card,
        setCard,
        errors: paymentErrors,
        method,
        setMethod,
        parameters: paymentParameters,
        canPay,
        paypal,
        paypalCredit
    } = usePayment({
        amount: checkResult.AmountDue,
        currency: model.currency,
        onPay(params) {
            return withLoading(handlePayPal(params));
        }
    });

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

    const goToStep = (step: SIGNUP_STEPS) => updateModel({ ...model, step });
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
                if (model.username && model.recoveryPhone) {
                    backStep = RECOVERY_PHONE;
                } else if (model.username) {
                    backStep = RECOVERY_EMAIL;
                } else if (model.email) {
                    backStep = VERIFICATION_CODE;
                }
                break;
            case HUMAN_VERIFICATION:
            case PAYMENT:
                backStep = PLANS;
                break;
        }
        if (backStep) {
            goToStep(backStep);
        }
    };

    const getTitle = () => {
        switch (model.step) {
            case ACCOUNT_CREATION_USERNAME:
            case ACCOUNT_CREATION_EMAIL:
                return c('Title').t`Create your Proton Account`;
            case RECOVERY_EMAIL:
                return c('Title').t`Add a recovery email (highly recommended)`;
            case RECOVERY_PHONE:
                return c('Title').t`Add a recovery phone (highly recommended)`;
            case VERIFICATION_CODE:
                return c('Title').t`Account verification`;
            case HUMAN_VERIFICATION:
                return c('Title').t`Are you human?`;
            case PAYMENT:
                return c('Title').t`Choose a payment method`;
            default:
                return '';
        }
    };

    const humanApi = <T,>(config: any): Promise<T> => humanApiHelper(config, { api, createModal, model, updateModel });

    const handleResend = async () => {
        await humanApi(queryVerificationCode('email', { Address: model.email }));
    };

    const handleSubmit = async (currentModel = model) => {
        const isBuyingPaidPlan = hasPaidPlan(currentModel);

        if (currentModel.step === ACCOUNT_CREATION_USERNAME) {
            try {
                await humanApi(queryCheckUsernameAvailability(currentModel.username));
                goToStep(RECOVERY_EMAIL);
            } catch (error) {
                setUsernameError(error.data ? error.data.Error : c('Error').t`Can't check username, try again later`);
            }
            return;
        }

        if (currentModel.step === ACCOUNT_CREATION_EMAIL) {
            await humanApi(queryVerificationCode('email', { Address: currentModel.email }));
            goToStep(VERIFICATION_CODE);
            return;
        }

        if (currentModel.step === RECOVERY_EMAIL) {
            if (isBuyingPaidPlan) {
                goToStep(PAYMENT);
                return;
            }
            goToStep(PLANS);
            return;
        }

        if (currentModel.step === RECOVERY_PHONE) {
            if (isBuyingPaidPlan) {
                goToStep(PAYMENT);
                return;
            }
            goToStep(PLANS);
            return;
        }

        if (currentModel.step === VERIFICATION_CODE) {
            const verificationToken = `${currentModel.email}:${currentModel.verificationCode}`;
            const verificationTokenType = TOKEN_TYPES.EMAIL;
            try {
                await humanApi(queryCheckVerificationCode(verificationToken, verificationTokenType, CLIENT_TYPE));
            } catch (error) {
                return createModal(
                    <InvalidVerificationCodeModal
                        edit={c('Action').t`Change email`}
                        request={c('Action').t`Request new code`}
                        onEdit={() => {
                            updateModel({
                                ...currentModel,
                                step: ACCOUNT_CREATION_EMAIL,
                                verificationCode: ''
                            });
                        }}
                        onResend={() => {
                            withLoading(handleResend());
                            updateModel({
                                ...currentModel,
                                verificationCode: ''
                            });
                        }}
                    />
                );
            }
            if (isBuyingPaidPlan) {
                updateModel({
                    ...currentModel,
                    step: PAYMENT,
                    verificationToken,
                    verificationTokenType
                });
                return;
            }
            updateModel({
                ...currentModel,
                step: PLANS,
                verificationToken,
                verificationTokenType
            });
            return;
        }

        if (currentModel.step === PLANS || currentModel.step === HUMAN_VERIFICATION || currentModel.step === PAYMENT) {
            const addresses = [];

            if (isBuyingPaidPlan && !currentModel.paymentToken) {
                goToStep(PAYMENT);
                return;
            }

            if (isBuyingPaidPlan) {
                const { Payment } = await handlePaymentToken({
                    params: {
                        ...paymentParameters,
                        Amount: checkResult.AmountDue,
                        Currency: currentModel.currency
                    },
                    api,
                    createModal,
                    mode: ''
                });
                updateModel({
                    ...currentModel,
                    paymentToken: Payment ? Payment.Details.Token : '',
                    paymentTokenType: TOKEN_TYPES.PAYMENT
                });
            }

            if (currentModel.username) {
                try {
                    await srpVerify({
                        api: humanApi,
                        credentials: { password: currentModel.password },
                        config: {
                            ...queryCreateUser({
                                Token: currentModel.paymentToken,
                                TokenType: currentModel.paymentTokenType,
                                Type: CLIENT_TYPE,
                                Email: currentModel.recoveryEmail,
                                Username: currentModel.username,
                                Payload: currentModel.payload
                            }),
                            silence: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED],
                            noHandling: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED]
                        }
                    });
                } catch (error) {
                    const { data: { Code, Details } = { Code: 0, Details: {} } } = error;
                    const { HumanVerificationMethods = [], HumanVerificationToken = '' } = Details;

                    if (Code === API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED) {
                        updateModel({
                            ...currentModel,
                            humanVerificationMethods: HumanVerificationMethods,
                            humanVerificationToken: HumanVerificationToken,
                            step: HUMAN_VERIFICATION
                        });
                        return;
                    }

                    throw error;
                }
            } else if (currentModel.email) {
                await srpVerify({
                    api,
                    credentials: { password: currentModel.password },
                    config: queryCreateUserExternal({
                        Token: currentModel.paymentToken,
                        TokenType: currentModel.paymentTokenType,
                        Type: CLIENT_TYPE,
                        Email: currentModel.email,
                        Payload: currentModel.payload
                    })
                });
            }

            const { UID, EventID, AccessToken, RefreshToken } = await srpAuth({
                api,
                credentials: { username: currentModel.username, password: currentModel.password },
                config: auth({ Username: currentModel.username })
            });

            if (isBuyingPaidPlan) {
                await api(
                    withAuthHeaders(
                        UID,
                        AccessToken,
                        subscribe({
                            PlanIDs: currentModel.planIDs,
                            Amount: 0, // Paid before subscription
                            Currency: currentModel.currency,
                            Cycle: currentModel.cycle
                            // TODO add coupon code
                        })
                    )
                );
            }

            await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
            await onLogin({ UID, EventID });

            // Create address
            if (currentModel.username) {
                const [domain = ''] = currentModel.domains;
                const { Address }: { Address: Address } = await api(
                    setupAddress({
                        Domain: domain,
                        DisplayName: currentModel.username,
                        Signature: ''
                    })
                );
                addresses.push(Address);
            } else if (currentModel.email) {
                const { Addresses = [] }: { Addresses: Address[] } = await api(queryAddresses());
                addresses.push(...Addresses);
            }

            // Generate keys
            if (addresses.length) {
                const { passphrase, salt } = await generateKeySaltAndPassphrase(currentModel.password);
                const newAddressesKeys = await getResetAddressesKeys({
                    addresses,
                    passphrase,
                    encryptionConfig: ENCRYPTION_CONFIGS[DEFAULT_ENCRYPTION_CONFIG]
                });
                // Assume the primary address is the first item in the list.
                const [primaryAddress] = newAddressesKeys;
                await srpVerify({
                    api,
                    credentials: { password: currentModel.password },
                    config: {
                        ...setupKeys({
                            KeySalt: salt,
                            PrimaryKey: primaryAddress.PrivateKey,
                            AddressKeys: newAddressesKeys
                        })
                    }
                });
            }
            return;
        }
    };

    const handleSelectPlan = async (planID: string) => {
        if (!planID) {
            // Select free plan
            const newModel = { ...model, planIDs: {} };
            updateModel(newModel);
            return handleSubmit(newModel);
        }

        const plan = plans.find(({ ID }: SignupPlan) => ID === planID);

        if (plan) {
            updateModel({
                ...model,
                planIDs: { [plan.ID]: 1 },
                step: PAYMENT
            });
            return;
        }
    };

    const fetchDependencies = async () => {
        try {
            const { Direct, VerifyMethods: verifyMethods } = await api(queryDirectSignupStatus(CLIENT_TYPE));

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
        // Remove error once username change
        if (usernameError) {
            setUsernameError('');
        }
    }, [model.username]);

    useEffect(() => {
        // Pre-select plan
        if (Array.isArray(plans) && preSelectedPlan) {
            const plan = plans.find(({ Name }: SignupPlan) => Name === preSelectedPlan);
            if (plan) {
                const planIDs = { [plan.ID]: 1 };
                updateModel({ ...model, planIDs });
            }
        }
    }, [plans]);

    useEffect(() => {
        const check = async () => {
            const result = (await humanApi(
                checkSubscription({
                    PlanIDs: model.planIDs,
                    Currency: model.currency,
                    Cycle: model.cycle
                    // CouponCode: model.couponCode
                })
            )) as SubscriptionCheckResult;
            setCheckResult(result);
        };

        if (hasPaidPlan(model)) {
            withLoading(check());
        }
    }, [model.cycle, model.planIDs]);

    return (
        <SignLayout
            title={getTitle()}
            larger={[PLANS, PAYMENT].includes(model.step)}
            left={
                [ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL].includes(model.step) ? null : (
                    <BackButton onClick={handleBack} />
                )
            }
            center={<ProtonLogo />}
            right={<SupportDropdown className="link" content={c('Action').t`Need help?`} />}
            aside={
                [ACCOUNT_CREATION_USERNAME, ACCOUNT_CREATION_EMAIL].includes(model.step) ? (
                    <SignupAside model={model} />
                ) : null
            }
        >
            {model.step === NO_SIGNUP && <NoSignup />}
            {model.step === ACCOUNT_CREATION_USERNAME && (
                <SignupAccountForm
                    history={history}
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => {
                        e.preventDefault();
                        withLoading(handleSubmit());
                    }}
                    loading={loading}
                />
            )}
            {model.step === ACCOUNT_CREATION_EMAIL && (
                <SignupAccountForm
                    history={history}
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => {
                        e.preventDefault();
                        withLoading(handleSubmit());
                    }}
                    loading={loading}
                />
            )}
            {model.step === RECOVERY_EMAIL && (
                <SignupRecoveryForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => {
                        e.preventDefault();
                        withLoading(handleSubmit());
                    }}
                    loading={loading}
                />
            )}
            {model.step === RECOVERY_PHONE && (
                <SignupRecoveryForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => {
                        e.preventDefault();
                        withLoading(handleSubmit());
                    }}
                    loading={loading}
                />
            )}
            {model.step === VERIFICATION_CODE && (
                <SignupVerificationCodeForm
                    model={model}
                    errors={errors}
                    onChange={updateModel}
                    onSubmit={(e) => {
                        e.preventDefault();
                        withLoading(handleSubmit());
                    }}
                    onResend={() => {
                        createModal(
                            <RequestNewCodeModal
                                onEdit={() =>
                                    updateModel({ ...model, verificationCode: '', step: ACCOUNT_CREATION_EMAIL })
                                }
                                onResend={() => {
                                    withLoading(handleResend());
                                    updateModel({ ...model, verificationCode: '' });
                                }}
                                email={model.email}
                            />
                        );
                    }}
                    loading={loading}
                />
            )}
            {model.step === PLANS && (
                <SignupPlans
                    plans={plans}
                    model={model}
                    onChange={updateModel}
                    onSelectPlan={(planID) => withLoading(handleSelectPlan(planID))}
                    loading={loading || loadingPlans}
                />
            )}
            {model.step === PAYMENT && (
                <SignupPayment
                    paypal={paypal}
                    paypalCredit={paypalCredit}
                    checkResult={checkResult}
                    model={model}
                    onChange={updateModel}
                    card={card}
                    onCardChange={setCard}
                    method={method}
                    onMethodChange={setMethod}
                    errors={paymentErrors}
                    canPay={canPay}
                    plans={plans}
                    loading={loading}
                />
            )}
            {model.step === HUMAN_VERIFICATION && (
                <SignupHumanVerification model={model} onChange={updateModel} onSubmit={handleSubmit} />
            )}
            {model.step === CREATING_ACCOUNT && <SignupCreatingAccount model={model} />}
            {model.step === COMPLETE && <SignupComplete model={model} />}
        </SignLayout>
    );
};

export default SignupContainer;
