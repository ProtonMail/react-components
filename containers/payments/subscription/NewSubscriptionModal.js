import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    classnames,
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
    useUser
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe } from 'proton-shared/lib/api/payments';

import SubscriptionCustomization from './SubscriptionCustomization';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';
import NewSubscriptionModalFooter from './NewSubscriptionModalFooter';

import './NewSubscriptionModal.scss';
import PayPalButton from '../PayPalButton';
import PaymentGiftCode from '../PaymentGiftCode';

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
        [STEPS.UPGRADE]: c('Title').t`Upgrading`,
        [STEPS.THANKS]: c('Title').t`Thanks`
    };

    const api = useApi();
    const [user] = useUser();
    const { call } = useEventManager();
    const [vpnCountries, loadingVpnCountries] = useVPNCountries();
    const [plans, loadingPlans] = usePlans();
    const [loading, withLoading] = useLoading();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState({});
    const { Code: couponCode } = checkResult.Coupon || {}; // Coupon can be null
    const [model, setModel] = useState({
        cycle,
        currency,
        coupon,
        planIDs
    });
    const [step, setStep] = useState(initialStep);

    const handleSubscribe = async (params) => {
        try {
            setStep(STEPS.UPGRADE);
            await withLoading(
                api(
                    subscribe({
                        Amount: checkResult.AmountDue,
                        PlanIDs: model.planIDs,
                        CouponCode: model.coupon,
                        GiftCode: model.gift,
                        Currency: model.currency,
                        Cycle: model.cycle,
                        ...params
                    })
                )
            );
            await withLoading(call());
            setStep(STEPS.THANKS);
        } catch (error) {
            setStep(checkResult.AmountDue ? STEPS.PAYMENT : STEPS.CUSTOMIZATION);
            throw error;
        }
    };

    const { card, setCard, errors, method, setMethod, parameters, canPay, paypal, paypalCredit } = usePayment({
        amount: checkResult.AmountDue,
        currency: checkResult.Currency,
        onPay: handleSubscribe
    });

    const Submit = ({ className }) => {
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
                <PrimaryButton className={className} loading={loadingCheck} onClick={onClose}>{c('Action')
                    .t`Done`}</PrimaryButton>
            );
        }

        return (
            <PrimaryButton className={className} loading={loadingCheck} disabled={!canPay} type="submit">{c('Action')
                .t`Pay`}</PrimaryButton>
        );
    };

    Submit.propTypes = {
        className: PropTypes.string
    };

    const check = async (newModel = model) => {
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
        if (!checkResult.AmountDue) {
            return handleSubscribe(parameters);
        }

        if (step === STEPS.CUSTOMIZATION) {
            return setStep(STEPS.PAYMENT);
        }

        handleSubscribe(parameters);
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
            footer={<NewSubscriptionModalFooter submit={<Submit />} step={step} model={model} />}
            className={classnames(['pm-modal--full subscription-modal', user.isFree && 'is-free-user'])}
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingVpnCountries}
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
                    <div className="w25 onmobile-w100">
                        <SubscriptionCheckout
                            submit={<Submit className="w100" />}
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
                        <Alert>{c('Info').t`You can use any of your saved payment methods or add a new one.`}</Alert>
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
                    </div>
                    <div className="w25 onmobile-w100">
                        <SubscriptionCheckout
                            method={method}
                            submit={<Submit className="w100" />}
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
            {step === STEPS.UPGRADE && <SubscriptionUpgrade />}
            {step === STEPS.THANKS && <SubscriptionThanks onClose={onClose} />}
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
