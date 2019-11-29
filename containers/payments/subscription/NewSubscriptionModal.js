import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { FormModal, CurrencySelector, CycleSelector, usePlans, useNotifications, useApi, useLoading, useSubscription } from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe } from 'proton-shared/lib/api/payments';
import { toMap } from 'proton-shared/lib/helpers/object';

import SubscriptionCustomization from './SubscriptionCustomization';
import SubscriptionPayment from './SubscriptionPayment';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';

const STEPS = {
    CUSTOMIZATION: 0,
    PAYMENT: 1,
    UPGRADE: 2,
    THANKS: 3
};

const NewSubscriptionModal = ({ step: initialStep = STEPS.CUSTOMIZATION, cycle = DEFAULT_CYCLE, currency = DEFAULT_CURRENCY, coupon, planIDs = [], ...rest }) => {
    const api = useApi();
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const [model, setModel] = useState({ cycle, currency, coupon, planIDs });
    const [step, setStep] = useState(initialStep);
    const plansMap = toMap(plans || []);

    const check = async (newModel = model) => {
        try {
            const { Coupon, Gift } = await api(checkSubscription({
                PlanIDs: newModel.planIDs,
                CouponCode: newModel.coupon,
                Currency: newModel.currency,
                Cycle: newModel.cycle
            }));

            if (newModel.coupon && newModel.coupon !== Coupon) {
                const text = c('Error').t`Your coupon is invalid or cannot be applied to your plan`;
                createNotification({ text, type: 'error' });
                throw new Error(text);
            }

            if (newModel.gift && !Gift) {
                const text = c('Error').t`Invalid gift code`;
                createNotification({ text, type: 'error' });
                throw new Error(text);
            }

            setModel(newModel);
        } catch (error) {
            throw error;
        }
    };

    const handleSubscribe = async () => {
        setStep(STEPS.UPGRADE);
    };

    return (
        <FormModal
            loading={loading || loadingPlans || loadingSubscription}
            {...rest}>
                <SubscriptionCheckout model={model} setModel={setModel} onSubscribe={handleSubscribe} />
                {step === STEPS.CUSTOMIZATION && <SubscriptionCustomization model={model} setModel={setModel} />}
                {step === STEPS.PAYMENT && <SubscriptionPayment model={model} />}
                {step === STEPS.UPGRADE && <SubscriptionUpgrade />}
                {step === STEPS.THANKS && <SubscriptionThanks />}
        </FormModal>
    );
};

NewSubscriptionModal.propTypes = {
    step: PropTypes.oneOf([STEPS.CUSTOMIZATION, STEPS.PAYMENT, STEPS.UPGRADE, STEPS.THANKS]),
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]),
    currency: PropTypes.oneOf(CURRENCIES),
    coupon: PropTypes.string,
    planIDs: PropTypes.arrayOf(PropTypes.string)
};

export default NewSubscriptionModal;