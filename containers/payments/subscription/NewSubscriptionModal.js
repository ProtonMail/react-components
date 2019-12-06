import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { FormModal, usePlans, useApi, useLoading, useSubscription, useNotifications } from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe } from 'proton-shared/lib/api/payments';

import SubscriptionCustomization from './SubscriptionCustomization';
import SubscriptionPayment from './SubscriptionPayment';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';

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
    ...rest
}) => {
    const TITLE = {
        [STEPS.CUSTOMIZATION]: c('Title').t`Plan customization`,
        [STEPS.PAYMENT]: c('Title').t`Billing details`,
        [STEPS.UPGRADE]: c('Title').t`???`, // TODO
        [STEPS.THANKS]: c('Title').t`???` // TODO
    };

    const api = useApi();
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState({});
    const [model, setModel] = useState({
        cycle,
        currency,
        coupon,
        planIDs
    });
    const [step, setStep] = useState(initialStep);

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

            if (newModel.coupon && newModel.coupon !== result.Coupon.Code) {
                const text = c('Error').t`Your coupon is invalid or cannot be applied to your plan`;
                createNotification({ text, type: 'error' });
                throw new Error(text);
            }

            if (newModel.gift && !result.Gift) {
                const text = c('Error').t`Invalid gift code`;
                createNotification({ text, type: 'error' });
                throw new Error(text);
            }

            setModel(newModel);
            setCheckResult(result);
        } catch (error) {
            throw error;
        }
    };

    const handleSubscribe = async () => {
        setStep(STEPS.UPGRADE);
        await withLoading(api(subscribe(subscription)));
    };

    const handleCheckout = () => {
        setStep(STEPS.PAYMENT);
    };

    useEffect(() => {
        withLoadingCheck(check());
    }, [model.cycle, model.planIDs]);

    return (
        <FormModal
            footer={null}
            className="pm-modal--full subscription-modal"
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingSubscription}
            {...rest}
        >
            {step === STEPS.CUSTOMIZATION && (
                <div className="flex flex-spacebetween">
                    <div className="w75 pr1">
                        <SubscriptionCustomization
                            plans={plans}
                            expanded={expanded}
                            model={model}
                            setModel={setModel}
                        />
                    </div>
                    <div className="w25">
                        <SubscriptionCheckout
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
                <SubscriptionPayment
                    loading={loading}
                    model={model}
                    setModel={setModel}
                    onSubscribe={handleSubscribe}
                />
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
