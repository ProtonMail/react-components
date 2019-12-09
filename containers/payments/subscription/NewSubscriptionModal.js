import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    FormModal,
    PrimaryButton,
    Button,
    Icon,
    usePlans,
    useApi,
    useLoading,
    useSubscription,
    useVPNCountries
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CYCLE, CURRENCIES, COUPON_CODES } from 'proton-shared/lib/constants';
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

const Footer = ({ step, model, checkResult, loading }) => {
    if ([STEPS.UPGRADE, STEPS.THANKS].includes(step)) {
        return null;
    }

    const cancel = step === STEPS.CUSTOMIZATION ? c('Action').t`Cancel` : c('Action').t`Back`;
    const submit =
        step === STEPS.CUSTOMIZATION
            ? checkResult.AmountDue
                ? c('Action').t`Continue`
                : c('Action').t`Finish`
            : c('Action').t`Finish`;
    const upsells = [
        model.cycle === CYCLE.MONTHLY && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="warning" name="off" />
                {c('Info').t`Save 20% by switching to annual billing`}
            </div>
        ), // TODO
        model.cycle === CYCLE.YEARLY && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving 20% with annual billing`}
            </div>
        ), // TODO
        model.cycle === CYCLE.TWO_YEARS && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving 33% with 2-year billing`}
            </div>
        ), // TODO
        model.coupon !== COUPON_CODES.BUNDLE && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="warning" name="off" />
                {c('Info').t`Save an extra 20% by combining Mail and VPN`}
            </div>
        ), // TODO
        model.coupon === COUPON_CODES.BUNDLE && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving an extra 20% with the bundle discount`}
            </div>
        ) // TODO
    ].filter(Boolean);

    return (
        <>
            <Button disabled={loading} type="reset">
                {cancel}
            </Button>
            {upsells}
            <PrimaryButton disabled={loading} type="submit">
                {submit}
            </PrimaryButton>
        </>
    );
};

Footer.propTypes = {
    loading: PropTypes.bool,
    step: PropTypes.number,
    model: PropTypes.object,
    checkResult: PropTypes.object
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
    const [vpnCountries, loadingVpnCountries] = useVPNCountries();
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const [loading, withLoading] = useLoading();
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

            const { Code = '' } = result.Coupon || {}; // Coupon can equal null
            newModel.coupon = Code;

            setModel(newModel);
            setCheckResult(result);
        } catch (error) {
            setModel(model);
            throw error;
        }
    };

    const handleSubscribe = async () => {
        setStep(STEPS.UPGRADE);
        await withLoading(api(subscribe(subscription)));
    };

    const handleCheckout = () => {
        if (!checkResult.AmountDue) {
            return handleSubscribe();
        }
        setStep(STEPS.PAYMENT);
    };

    useEffect(() => {
        withLoadingCheck(check());
    }, [model.cycle, model.planIDs]);

    return (
        <FormModal
            footer={
                <Footer
                    step={step}
                    model={model}
                    checkResult={checkResult}
                    loading={loading || loadingPlans || loadingSubscription || loadingVpnCountries}
                />
            }
            className="pm-modal--full subscription-modal"
            title={TITLE[step]}
            loading={loading || loadingPlans || loadingSubscription || loadingVpnCountries}
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
