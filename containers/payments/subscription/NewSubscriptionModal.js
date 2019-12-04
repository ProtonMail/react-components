import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    FormModal,
    usePlans,
    useNotifications,
    useApi,
    useLoading,
    useSubscription,
    useConfig
} from 'react-components';
import {
    DEFAULT_CURRENCY,
    DEFAULT_CYCLE,
    CYCLE,
    CURRENCIES,
    PLAN_SERVICES,
    PLAN_TYPES,
    CLIENT_TYPES
} from 'proton-shared/lib/constants';
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

const SERVICES = {
    [CLIENT_TYPES.MAIL]: PLAN_SERVICES.MAIL,
    [CLIENT_TYPES.VPN]: PLAN_SERVICES.VPN
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

    const { CLIENT_TYPE } = useConfig();
    const api = useApi();
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const plansMap = toMap(plans || []);
    const [model, setModel] = useState({
        cycle,
        currency,
        coupon,
        planIDs
    });
    const [step, setStep] = useState(initialStep);

    const { Name = 'free' } =
        Object.entries(model.planIDs)
            .filter(([, quantity]) => quantity)
            .map(([planID]) => plansMap[planID])
            .find(({ Type, Services }) => Type === PLAN_TYPES.PLAN && Services & SERVICES[CLIENT_TYPE]) || {};

    const check = async (newModel = model) => {
        try {
            const { Coupon, Gift } = await api(
                checkSubscription({
                    PlanIDs: newModel.planIDs,
                    CouponCode: newModel.coupon,
                    Currency: newModel.currency,
                    Cycle: newModel.cycle
                })
            );

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
        await api(subscribe(subscription));
    };

    const handleCheckout = async () => {};

    useEffect(() => {
        withLoading(check());
    }, []);

    return (
        <FormModal
            footer={null}
            className="pm-modal--wider" // TODO need a fullscreen class
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingSubscription}
            {...rest}
        >
            {step === STEPS.CUSTOMIZATION && (
                <div className="flex flex-spacebetween">
                    <div className="w75 pr1">
                        <SubscriptionCustomization
                            planName={Name}
                            plans={plans}
                            expanded={expanded}
                            model={model}
                            setModel={setModel}
                        />
                    </div>
                    <div className="w25">
                        <SubscriptionCheckout
                            onCheckout={handleCheckout}
                            model={model}
                            setModel={setModel}
                            onSubscribe={handleSubscribe}
                        />
                    </div>
                </div>
            )}
            {step === STEPS.PAYMENT && <SubscriptionPayment model={model} setModel={setModel} />}
            {step === STEPS.UPGRADE && <SubscriptionUpgrade />}
            {step === STEPS.THANKS && <SubscriptionThanks />}
        </FormModal>
    );
};

NewSubscriptionModal.propTypes = {
    expanded: PropTypes.bool,
    step: PropTypes.oneOf([STEPS.CUSTOMIZATION, STEPS.PAYMENT, STEPS.UPGRADE, STEPS.THANKS]),
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]),
    currency: PropTypes.oneOf(CURRENCIES),
    coupon: PropTypes.string,
    planIDs: PropTypes.object
};

export default NewSubscriptionModal;
