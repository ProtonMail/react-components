import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Button, Title, useLoading, TextLoader, VpnLogo, Href, FullLoader, SupportDropdown } from 'react-components';
import { checkCookie } from 'proton-shared/lib/helpers/cookies';
import { CYCLE, CLIENT_TYPES } from 'proton-shared/lib/constants';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';
import { PLAN, getAvailablePlans } from './plans';
import PlanDetails from './SelectedPlan/PlanDetails';
import PlanUpsell from './SelectedPlan/PlanUpsell';
import useVerification from './VerificationStep/useVerification';
import MobileRedirectionStep from './MobileRedirectionStep/MobileRedirectionStep';
import useConfig from '../config/useConfig';
import MailLogo from '../../components/logo/MailLogo';

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment',
    MobileRedirection: 'mobile-redirection'
};

const SignupContainer = ({ match, history, onLogin, redirectUrl, stopRedirect, renderPlansTable, homepageUrl }) => {
    const { CLIENT_TYPE } = useConfig();
    const searchParams = new URLSearchParams(history.location.search);
    const preSelectedPlan = searchParams.get('plan');
    const redirectToMobile = searchParams.get('from') === 'mobile';
    const availablePlans = getAvailablePlans(CLIENT_TYPE, checkCookie('offer', 'bestdeal'));
    const appName = CLIENT_TYPE === CLIENT_TYPES.VPN ? 'ProtonVPN' : 'ProtonMail';

    useEffect(() => {
        document.title = c('Title').t`Sign up - ${appName}`;
        // Always start at plans, or account if plan is preselected
        if (preSelectedPlan) {
            history.replace(`/signup/${SignupState.Account}`, history.location.state);
        } else {
            history.replace('/signup', history.location.state);
        }
    }, []);

    const signupState = match.params.step;
    const [upsellDone, setUpsellDone] = useState(false);
    const [creatingAccount, withCreateLoading] = useLoading(false);
    const historyState = history.location.state || {};
    const invite = historyState.invite;
    const coupon = historyState.coupon;

    const goToStep = (step) => history.push(`/signup/${step}`);

    const handleLogin = (...args) => {
        if (redirectToMobile) {
            return goToStep(SignupState.MobileRedirection);
        }

        stopRedirect();
        history.push(redirectUrl);
        onLogin(...args);
    };

    const {
        model,
        setModel,
        signup,
        selectedPlan,
        makePayment,
        signupAvailability,
        getPlanByName,
        isLoading,
        appliedCoupon,
        appliedInvite
    } = useSignup(
        handleLogin,
        { coupon, invite, availablePlans },
        {
            planName: preSelectedPlan,
            cycle: Number(searchParams.get('billing')),
            currency: searchParams.get('currency')
        }
    );
    const { verify, requestCode } = useVerification();

    const handleSelectPlan = (model, next = false) => {
        setModel(model);
        next && goToStep(SignupState.Account);
    };

    const handleCreateAccount = async (model) => {
        setModel(model);

        if (selectedPlan.price.total > 0) {
            goToStep(SignupState.Payment);
        } else if (appliedInvite || appliedCoupon) {
            await withCreateLoading(signup(model, { invite: appliedInvite, coupon: appliedCoupon }));
        } else {
            goToStep(SignupState.Verification);
        }
    };

    const handleVerification = async (model, code, params) => {
        const verificationToken = await verify(code, params);
        await signup(model, { verificationToken });
        setModel(model);
    };

    const handlePayment = async (model, paymentParameters = {}) => {
        const paymentDetails = await makePayment(model, paymentParameters);
        const { Payment = {} } = paymentParameters;
        const { Type = '' } = Payment;
        await withCreateLoading(signup(model, { paymentDetails, paymentMethodType: Type }));
        setModel(model);
    };

    const handleUpgrade = (planName) => {
        setModel({ ...model, planName });
        setUpsellDone(true);
        if (planName !== PLAN.FREE && signupState === SignupState.Verification) {
            goToStep(SignupState.Payment);
        } else if (planName === PLAN.FREE && signupState === SignupState.Payment) {
            goToStep(SignupState.Verification);
        }
    };

    const handleExtendCycle = () => {
        setModel({ ...model, cycle: CYCLE.YEARLY });
        setUpsellDone(true);
    };

    const selectedPlanComponent = (
        <div className="ml2 onmobile-ml0 flex-item-fluid-auto onmobile-mt2 selected-plan">
            <PlanDetails selectedPlan={selectedPlan} cycle={model.cycle} currency={model.currency} />
            {!upsellDone && (
                <PlanUpsell
                    selectedPlan={selectedPlan}
                    getPlanByName={getPlanByName}
                    onExtendCycle={handleExtendCycle}
                    onUpgrade={handleUpgrade}
                    cycle={model.cycle}
                    currency={model.currency}
                />
            )}
        </div>
    );

    return (
        <main className="flex flex-item-fluid main-area">
            <div className="center p2 container-plans-signup onmobile-p1">
                <div className="flex flex-nowrap flex-items-center onmobile-flex-wrap mb1">
                    <div className="flex-item-fluid plan-back-button">
                        {!creatingAccount &&
                            (signupState && signupState !== SignupState.Plan ? (
                                <Button onClick={() => history.goBack()}>{c('Action').t`Back`}</Button>
                            ) : (
                                <Href className="pm-button" url={homepageUrl} target="_self">{c('Action')
                                    .t`Homepage`}</Href>
                            ))}
                    </div>
                    <div className="onmobile-min-w100 onmobile-aligncenter onmobile-mt0-5">
                        <Href url="https://protonvpn.com" target="_self">
                            {CLIENT_TYPE === CLIENT_TYPES.VPN ? (
                                <VpnLogo className="fill-primary" />
                            ) : (
                                <MailLogo className="fill-primary" />
                            )}
                        </Href>
                    </div>
                    <div className="flex-item-fluid alignright plan-help-button">
                        <SupportDropdown content={c('Action').t`Need help`} />
                    </div>
                </div>

                <Title className="signup-title mt1-5">{c('Title').t`Sign up`}</Title>

                {isLoading || creatingAccount ? (
                    <div className="aligncenter mt2">
                        <FullLoader color="pm-primary" size={200} />
                        <TextLoader>{isLoading ? c('Info').t`Loading` : c('Info').t`Creating your account`}</TextLoader>
                    </div>
                ) : (
                    <>
                        {(!signupState || signupState === SignupState.Plan) && (
                            <PlanStep
                                renderPlansTable={renderPlansTable}
                                plans={availablePlans.map((plan) => getPlanByName(plan))}
                                model={model}
                                onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                                onChangeCurrency={(currency) => setModel({ ...model, currency })}
                                signupAvailability={signupAvailability}
                                onSelectPlan={handleSelectPlan}
                            />
                        )}
                        {signupState === SignupState.Account && (
                            <AccountStep model={model} onContinue={handleCreateAccount}>
                                {selectedPlanComponent}
                            </AccountStep>
                        )}
                        {signupState === SignupState.Verification && (
                            <VerificationStep
                                model={model}
                                allowedMethods={signupAvailability.allowedMethods}
                                onVerify={(...rest) => withCreateLoading(handleVerification(...rest))}
                                requestCode={requestCode}
                            >
                                {selectedPlanComponent}
                            </VerificationStep>
                        )}
                        {signupState === SignupState.Payment && (
                            <PaymentStep model={model} paymentAmount={selectedPlan.price.total} onPay={handlePayment}>
                                {selectedPlanComponent}
                            </PaymentStep>
                        )}
                        {signupState === SignupState.MobileRedirection && <MobileRedirectionStep model={model} />}
                    </>
                )}
            </div>
        </main>
    );
};

SignupContainer.propTypes = {
    redirectUrl: PropTypes.string.isRequired,
    homepageUrl: PropTypes.string.isRequired,
    stopRedirect: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            step: PropTypes.string
        })
    }).isRequired,
    renderPlansTable: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        location: PropTypes.shape({
            search: PropTypes.string.isRequired,
            state: PropTypes.oneOfType([
                PropTypes.shape({
                    selector: PropTypes.string.isRequired,
                    token: PropTypes.string.isRequired
                }),
                PropTypes.shape({
                    Coupon: PropTypes.shape({ Code: PropTypes.string })
                })
            ])
        }).isRequired
    }).isRequired
};

export default SignupContainer;
