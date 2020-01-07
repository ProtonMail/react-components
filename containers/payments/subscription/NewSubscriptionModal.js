import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    classnames,
    LossLoyaltyModal,
    Alert,
    PrimaryButton,
    FormModal,
    Payment,
    usePlans,
    useApi,
    useLoading,
    useVPNCountries,
    useEventManager,
    usePayment,
    useUser,
    useNotifications,
    useOrganization,
    useModals
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe, deleteSubscription } from 'proton-shared/lib/api/payments';
import { isLoyal } from 'proton-shared/lib/helpers/organization';

import SubscriptionCustomization from './SubscriptionCustomization';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';
import NewSubscriptionModalFooter from './NewSubscriptionModalFooter';
import PaymentGiftCode from '../PaymentGiftCode';
import PayPalButton from '../PayPalButton';
import './NewSubscriptionModal.scss';

const STEPS = {
    CUSTOMIZATION: 0,
    PAYMENT: 1,
    UPGRADE: 2,
    THANKS: 3
};

const clearPlanIDs = (planIDs = {}) => {
    return Object.entries(planIDs).reduce((acc, [planID, quantity]) => {
        if (!quantity) {
            return acc;
        }
        acc[planID] = quantity;
        return acc;
    }, {});
};

const hasPlans = (planIDs = {}) => Object.keys(clearPlanIDs(planIDs)).length;

const NewSubscriptionModal = ({
    expanded = false,
    step: initialStep = STEPS.CUSTOMIZATION,
    cycle = DEFAULT_CYCLE,
    currency = DEFAULT_CURRENCY,
    coupon,
    planIDs = {},
    onClose,
    ...rest
}) => {
    const TITLE = {
        [STEPS.CUSTOMIZATION]: c('Title').t`Plan customization`,
        [STEPS.PAYMENT]: c('Title').t`Checkout`,
        [STEPS.UPGRADE]: <div className="aligncenter">{c('Title').t`Processing...`}</div>,
        [STEPS.THANKS]: <div className="aligncenter">{c('Title').t`Thank you!`}</div>
    };

    const api = useApi();
    const [user] = useUser();
    const { call } = useEventManager();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const [vpnCountries, loadingVpnCountries] = useVPNCountries();
    const [plans, loadingPlans] = usePlans();
    const [organization, loadingOrganization] = useOrganization();
    const [loading, withLoading] = useLoading();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState({});
    const { Code: couponCode, Credit = 0 } = checkResult.Coupon || {}; // Coupon can be null
    const creditsRemaining = (user.Credit + Credit) / 100;
    const [model, setModel] = useState({
        cycle,
        currency,
        coupon,
        planIDs
    });
    const [step, setStep] = useState(initialStep);

    const TOTAL_ZERO = {
        Amount: 0,
        AmountDue: 0,
        CouponDiscount: 0,
        Currency: model.currency,
        Cycle: model.cycle,
        Proration: 0,
        Gift: 0,
        Credit: 0
    };

    const handleUnsubscribe = async () => {
        if (isLoyal(organization)) {
            await new Promise((resolve, reject) => {
                createModal(<LossLoyaltyModal user={user} onConfirm={resolve} onClose={reject} />);
            });
        }
        await api(deleteSubscription());
        await call();
        onClose();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleSubscribe = async (params) => {
        if (!hasPlans(model.planIDs)) {
            return handleUnsubscribe();
        }

        try {
            setStep(STEPS.UPGRADE);
            await api(
                subscribe({
                    Amount: checkResult.AmountDue,
                    PlanIDs: model.planIDs,
                    CouponCode: model.coupon,
                    GiftCode: model.gift,
                    Currency: model.currency,
                    Cycle: model.cycle,
                    ...params
                })
            );
            await call();
            setStep(STEPS.THANKS);
        } catch (error) {
            setStep(STEPS.PAYMENT);
            throw error;
        }
    };

    const { card, setCard, errors, method, setMethod, parameters, canPay, paypal, paypalCredit } = usePayment({
        amount: checkResult.AmountDue,
        currency: checkResult.Currency,
        onPay(params) {
            return withLoading(handleSubscribe(params));
        }
    });

    const SubmitButton = ({ className }) => {
        if (step === STEPS.CUSTOMIZATION) {
            return (
                <PrimaryButton className={className} loading={loadingCheck} type="submit">{c('Action')
                    .t`Continue`}</PrimaryButton>
            );
        }

        if (method === PAYMENT_METHOD_TYPES.PAYPAL) {
            return (
                <PayPalButton paypal={paypal} className={className} amount={checkResult.AmountDue}>{c('Action')
                    .t`Pay`}</PayPalButton>
            );
        }

        if ([PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(method)) {
            return (
                <PrimaryButton className={className} loading={loadingCheck} onClick={() => setStep(STEPS.THANKS)}>{c(
                    'Action'
                ).t`Done`}</PrimaryButton>
            );
        }

        if (!checkResult.AmountDue) {
            return (
                <PrimaryButton className={className} loading={loadingCheck} disabled={!canPay} type="submit">{c(
                    'Action'
                ).t`Complete`}</PrimaryButton>
            );
        }

        return (
            <PrimaryButton className={className} loading={loadingCheck} disabled={!canPay} type="submit">{c('Action')
                .t`Pay`}</PrimaryButton>
        );
    };

    SubmitButton.propTypes = {
        className: PropTypes.string
    };

    const check = async (newModel = model) => {
        if (!hasPlans(newModel.planIDs)) {
            setCheckResult(TOTAL_ZERO);
            return;
        }

        try {
            const result = await api(
                checkSubscription({
                    PlanIDs: clearPlanIDs(newModel.planIDs),
                    CouponCode: newModel.coupon,
                    Currency: newModel.currency,
                    Cycle: newModel.cycle,
                    GiftCode: newModel.gift
                })
            );

            const { Code = '' } = result.Coupon || {}; // Coupon can equal null
            newModel.coupon = Code;

            if (!result.Gift) {
                delete newModel.gift;
            }

            setModel(newModel);
            setCheckResult(result);
        } catch (error) {
            setModel(model);
            throw error;
        }
    };

    const handleCheckout = () => {
        if (step === STEPS.CUSTOMIZATION) {
            return setStep(STEPS.PAYMENT);
        }

        withLoading(handleSubscribe(parameters));
    };

    const handleClose = (e) => {
        if (step === STEPS.PAYMENT) {
            setStep(STEPS.CUSTOMIZATION);
            return;
        }

        onClose(e);
    };

    const handleGift = (gift = '') => {
        withLoadingCheck(check({ ...model, gift }));
    };

    useEffect(() => {
        withLoadingCheck(check());
    }, [model.cycle, model.planIDs]);

    return (
        <FormModal
            hasClose={step === STEPS.CUSTOMIZATION}
            footer={
                [STEPS.UPGRADE, STEPS.THANKS].includes(step) ? null : (
                    <NewSubscriptionModalFooter
                        submit={<SubmitButton className="flex-item-noshrink" />}
                        step={step}
                        model={model}
                    />
                )
            }
            className={classnames([
                'subscription-modal',
                [STEPS.CUSTOMIZATION, STEPS.PAYMENT].includes(step) && 'pm-modal--full',
                user.isFree && 'is-free-user'
            ])}
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingVpnCountries || loadingOrganization}
            onSubmit={handleCheckout}
            onClose={handleClose}
            {...rest}
        >
            {step === STEPS.CUSTOMIZATION && (
                <div className="flex flex-spacebetween onmobile-flex-column">
                    <div className="w75 onmobile-w100 pr1 onmobile-pr0">
                        <SubscriptionCustomization
                            vpnCountries={vpnCountries}
                            loading={loadingCheck}
                            plans={plans}
                            expanded={expanded}
                            model={model}
                            setModel={setModel}
                        />
                    </div>
                    <div className="w25 onmobile-w100 pt2 mt1-5 onmobile-mt0 onmobile-pt0">
                        <SubscriptionCheckout
                            submit={<SubmitButton className="w100" />}
                            plans={plans}
                            checkResult={checkResult}
                            loading={loadingCheck}
                            onCheckout={handleCheckout}
                            model={model}
                            setModel={setModel}
                        />
                        <PaymentGiftCode gift={model.gift} onApply={handleGift} loading={loadingCheck} />
                    </div>
                </div>
            )}
            {step === STEPS.PAYMENT && (
                <div className="flex flex-spacebetween onmobile-flex-column">
                    <div className="w75 onmobile-w100 pr1 onmobile-pr0">
                        <h3>{c('Title').t`Payment method`}</h3>
                        {checkResult.AmountDue ? (
                            <>
                                <Alert>{c('Info')
                                    .t`You can use any of your saved payment methods or add a new one.`}</Alert>
                                <Payment
                                    type="subscription"
                                    paypal={paypal}
                                    paypalCredit={paypalCredit}
                                    method={method}
                                    amount={checkResult.AmountDue}
                                    currency={checkResult.Currency}
                                    coupon={couponCode}
                                    card={card}
                                    onMethod={setMethod}
                                    onCard={setCard}
                                    errors={errors}
                                />
                            </>
                        ) : (
                            <>
                                <Alert>{c('Info').t`No payment is required at this time.`}</Alert>
                                {checkResult.Credit && creditsRemaining ? (
                                    <Alert>{c('Info')
                                        .t`Please note that upon clicking the Confirm button, your account will have ${creditsRemaining} credits remaining.`}</Alert>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div className="w25 onmobile-w100">
                        <SubscriptionCheckout
                            method={method}
                            submit={<SubmitButton className="w100" />}
                            plans={plans}
                            checkResult={checkResult}
                            loading={loadingCheck}
                            onCheckout={handleCheckout}
                            model={model}
                            setModel={setModel}
                        />
                        {checkResult.Amount ? (
                            <PaymentGiftCode gift={model.gift} onApply={handleGift} loading={loadingCheck} />
                        ) : null}
                    </div>
                </div>
            )}
            {step === STEPS.UPGRADE && <SubscriptionUpgrade />}
            {step === STEPS.THANKS && <SubscriptionThanks method={method} onClose={onClose} />}
        </FormModal>
    );
};

NewSubscriptionModal.propTypes = {
    expanded: PropTypes.bool,
    step: PropTypes.oneOf([STEPS.CUSTOMIZATION, STEPS.PAYMENT, STEPS.UPGRADE, STEPS.THANKS]),
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]),
    currency: PropTypes.oneOf(CURRENCIES),
    coupon: PropTypes.string,
    planIDs: PropTypes.object,
    onClose: PropTypes.func
};

export default NewSubscriptionModal;
