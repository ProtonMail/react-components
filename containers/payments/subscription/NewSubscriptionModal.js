import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Alert,
    FormModal,
    Payment,
    usePlans,
    useApi,
    useLoading,
    useVPNCountries,
    useEventManager,
    usePayment,
    useCard
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe } from 'proton-shared/lib/api/payments';

import SubscriptionCustomization from './SubscriptionCustomization';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';
import NewSubscriptionModalFooter from './NewSubscriptionModalFooter';

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
        [STEPS.PAYMENT]: c('Title').t`Billing details`,
        [STEPS.UPGRADE]: c('Title').t`???`, // TODO
        [STEPS.THANKS]: c('Title').t`???` // TODO
    };

    const api = useApi();
    const { call } = useEventManager();
    const [vpnCountries, loadingVpnCountries] = useVPNCountries();
    const [plans, loadingPlans] = usePlans();
    const [loading, withLoading] = useLoading();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState({});
    const card = useCard();
    const { method, setMethod, parameters, setParameters, canPay, setCardValidity } = usePayment();
    const { Code: couponCode } = checkResult.Coupon || {}; // Coupon can be null
    const [model, setModel] = useState({
        cycle,
        currency,
        coupon,
        planIDs
    });
    const [step, setStep] = useState(initialStep);
    const submit =
        step === STEPS.CUSTOMIZATION
            ? checkResult.AmountDue
                ? c('Action').t`Continue`
                : c('Action').t`Finish`
            : c('Action').t`Pay`;

    /**
     * Check current configuration to see if it's valid
     * @param {Object} newModel
     * @returns {Promise}
     */
    const check = async (newModel = model) => {
        try {
            const result = await api(
                checkSubscription({
                    PlanIDs: clearPlanIDs(newModel.planIDs),
                    CouponCode: newModel.coupon,
                    Currency: newModel.currency,
                    Cycle: newModel.cycle
                })
            );

            const { Code = '' } = result.Coupon || {}; // Coupon can equal null
            newModel.coupon = Code;

            setModel(newModel);
            setCheckResult(result);
        } catch (error) {
            setModel(model);
            throw error;
        }
    };

    /**
     * Subscribe to a new subscription
     * @return {Promise}
     */
    const handleSubscribe = async () => {
        try {
            setStep(STEPS.UPGRADE);
            await withLoading(
                api(
                    subscribe({
                        Amount: checkResult.AmountDue,
                        PlanIDs: model.planIDs,
                        CouponCode: model.coupon,
                        Currency: model.currency,
                        Cycle: model.cycle,
                        ...parameters
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

    const handleCheckout = () => {
        if (!checkResult.AmountDue) {
            return handleSubscribe();
        }
        setStep(STEPS.PAYMENT);
    };

    const handleClose = (e) => {
        if (step === STEPS.PAYMENT) {
            setStep(STEPS.CUSTOMIZATION);
            return;
        }

        onClose(e);
    };

    useEffect(() => {
        withLoadingCheck(check());
    }, [model.cycle, model.planIDs]);

    return (
        <FormModal
            footer={
                <NewSubscriptionModalFooter
                    submit={submit}
                    step={step}
                    model={model}
                    disabled={step === STEPS.PAYMENT ? !canPay : false}
                    loading={loadingCheck}
                />
            }
            className="pm-modal--full subscription-modal"
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingVpnCountries}
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
                            submit={submit}
                            plans={plans}
                            checkResult={checkResult}
                            loading={loadingCheck}
                            onCheckout={handleCheckout}
                            model={model}
                            setModel={setModel}
                        />
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
                            method={method}
                            amount={checkResult.AmountDue}
                            currency={checkResult.Currency}
                            coupon={couponCode}
                            parameters={parameters}
                            card={card}
                            onParameters={setParameters}
                            onMethod={setMethod}
                            onValidCard={setCardValidity}
                            onPay={handleSubscribe}
                        />
                    </div>
                    <div className="w25 onmobile-w100">
                        <SubscriptionCheckout
                            submit={submit}
                            plans={plans}
                            checkResult={checkResult}
                            loading={loadingCheck}
                            onCheckout={handleCheckout}
                            model={model}
                            setModel={setModel}
                            disabled={!canPay}
                        />
                    </div>
                </div>
            )}
            {step === STEPS.UPGRADE && <SubscriptionUpgrade />}
            {step === STEPS.THANKS && <SubscriptionThanks onClose={rest.onClose} />}
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
