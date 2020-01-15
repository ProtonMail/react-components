import React from 'react';
import PropTypes from 'prop-types';
import { useAddresses, Button, Loader } from 'react-components';
import { c } from 'ttag';
import { CYCLE, COUPON_CODES, PLANS } from 'proton-shared/lib/constants';
import shieldSvg from 'design-system/assets/img/shared/shield.svg';
import percentageSvg from 'design-system/assets/img/shared/percentage.svg';
import clockSvg from 'design-system/assets/img/shared/clock.svg';
import tickSvg from 'design-system/assets/img/shared/tick.svg';

import { SUBSCRIPTION_STEPS } from './constants';

const TickIcon = () => <img className="mr0-5 flex-item-noshrink" src={tickSvg} alt="checkmark" />;
const PercentageIcon = () => <img className="mr0-5 flex-item-noshrink" src={percentageSvg} alt="percentage" />;
const ShieldIcon = () => <img className="mr0-5 flex-item-noshrink" src={shieldSvg} alt="percentage" />;
const ClockIcon = () => <img className="mr0-5 flex-item-noshrink" src={clockSvg} alt="percentage" />;

const NewSubscriptionModalFooter = ({ submit, step, model, plans, onClose }) => {
    const { ID: visionaryID } = plans.find(({ Name }) => Name === PLANS.VISIONARY);
    const [addresses, loadingAddresses] = useAddresses();
    const isVisionary = !!model.planIDs[visionaryID];

    if (loadingAddresses) {
        return <Loader />;
    }

    if (step === SUBSCRIPTION_STEPS.NETWORK_ERROR) {
        return <Button onClick={onClose}>{c('Action').t`Close`}</Button>;
    }

    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const cancel = step === SUBSCRIPTION_STEPS.CUSTOMIZATION ? c('Action').t`Cancel` : c('Action').t`Back`;
    const upsells = [
        step === SUBSCRIPTION_STEPS.CUSTOMIZATION && model.cycle === CYCLE.MONTHLY && (
            <div key="upsell-1" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                <PercentageIcon />
                <span className="flex-item-fluid">{c('Info').t`Save 20% by switching to annual billing`}</span>
            </div>
        ),
        step === SUBSCRIPTION_STEPS.CUSTOMIZATION && model.cycle === CYCLE.YEARLY && (
            <div key="upsell-2" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                <TickIcon />
                <span className="flex-item-fluid">{c('Info').t`You are saving 20% with annual billing`}</span>
            </div>
        ),
        step === SUBSCRIPTION_STEPS.CUSTOMIZATION && model.cycle === CYCLE.TWO_YEARS && (
            <div key="upsell-3" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                <TickIcon />
                <span className="flex-item-fluid">{c('Info').t`You are saving 33% with 2-year billing`}</span>
            </div>
        ),
        step === SUBSCRIPTION_STEPS.CUSTOMIZATION &&
            hasAddresses &&
            model.coupon !== COUPON_CODES.BUNDLE &&
            !isVisionary && (
                <div key="upsell-4" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                    <PercentageIcon />
                    <span className="flex-item-fluid">{c('Info').t`Save an extra 20% by combining Mail and VPN`}</span>
                </div>
            ),
        step === SUBSCRIPTION_STEPS.CUSTOMIZATION &&
            hasAddresses &&
            (model.coupon === COUPON_CODES.BUNDLE || isVisionary) && (
                <div key="upsell-5" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                    <TickIcon />
                    <span className="flex-item-fluid">
                        {c('Info').t`You are saving an extra 20% with the bundle discount`}
                    </span>
                </div>
            ),
        step === SUBSCRIPTION_STEPS.PAYMENT && (
            <div key="upsell-6" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                <ClockIcon />
                <span className="flex-item-fluid">{c('Info').t`30-days money back guaranteed`}</span>
            </div>
        ),
        step === SUBSCRIPTION_STEPS.PAYMENT && (
            <div key="upsell-7" className="nomobile flex flex-nowrap flex-items-center pl1 pr1">
                <ShieldIcon />
                <span className="flex-item-fluid">
                    {c('Info').t`Payments are protected with TLS encryption and Swiss privacy laws`}
                </span>
            </div>
        )
    ].filter(Boolean);

    return (
        <>
            <Button onClick={onClose} className="flex-item-noshrink">
                {cancel}
            </Button>
            {upsells}
            {submit}
        </>
    );
};

NewSubscriptionModalFooter.propTypes = {
    plans: PropTypes.array.isRequired,
    submit: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    step: PropTypes.number,
    model: PropTypes.object
};

export default NewSubscriptionModalFooter;
