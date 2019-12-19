import React from 'react';
import PropTypes from 'prop-types';
import { useAddresses, Button, Loader } from 'react-components';
import { c } from 'ttag';
import { CYCLE, COUPON_CODES } from 'proton-shared/lib/constants';
import shieldSvg from 'design-system/assets/img/shared/shield.svg';
import percentageSvg from 'design-system/assets/img/shared/percentage.svg';
import clockSvg from 'design-system/assets/img/shared/clock.svg';
import tickSvg from 'design-system/assets/img/shared/tick.svg';

const STEPS = {
    CUSTOMIZATION: 0,
    PAYMENT: 1,
    UPGRADE: 2,
    THANKS: 3
};

const TickIcon = () => <img className="mr0-5" src={tickSvg} alt="checkmark" />;
const PercentageIcon = () => <img className="mr0-5" src={percentageSvg} alt="percentage" />;
const ShieldIcon = () => <img className="mr0-5" src={shieldSvg} alt="percentage" />;
const ClockIcon = () => <img className="mr0-5" src={clockSvg} alt="percentage" />;

const NewSubscriptionModalFooter = ({ submit, step, model }) => {
    const [addresses, loadingAddresses] = useAddresses();

    if (loadingAddresses) {
        return <Loader />;
    }

    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const cancel = step === STEPS.CUSTOMIZATION ? c('Action').t`Cancel` : c('Action').t`Back`;
    const upsells = [
        step === STEPS.CUSTOMIZATION && model.cycle === CYCLE.MONTHLY && (
            <div key="upsell-1" className="nomobile">
                <PercentageIcon />
                {c('Info').t`Save 20% by switching to annual billing`}
            </div>
        ),
        step === STEPS.CUSTOMIZATION && model.cycle === CYCLE.YEARLY && (
            <div key="upsell-2" className="nomobile">
                <TickIcon />
                {c('Info').t`You are saving 20% with annual billing`}
            </div>
        ),
        step === STEPS.CUSTOMIZATION && model.cycle === CYCLE.TWO_YEARS && (
            <div key="upsell-3" className="nomobile">
                <TickIcon />
                {c('Info').t`You are saving 33% with 2-year billing`}
            </div>
        ),
        step === STEPS.CUSTOMIZATION && hasAddresses && model.coupon !== COUPON_CODES.BUNDLE && (
            <div key="upsell-4" className="nomobile">
                <PercentageIcon />
                {c('Info').t`Save an extra 20% by combining Mail and VPN`}
            </div>
        ),
        step === STEPS.CUSTOMIZATION && hasAddresses && model.coupon === COUPON_CODES.BUNDLE && (
            <div key="upsell-5" className="nomobile">
                <TickIcon />
                {c('Info').t`You are saving an extra 20% with the bundle discount`}
            </div>
        ),
        step === STEPS.PAYMENT && (
            <div key="upsell-6" className="nomobile">
                <ClockIcon />
                {c('Info').t`30-days money back guaranteed`}
            </div>
        ),
        step === STEPS.PAYMENT && (
            <div key="upsell-7" className="nomobile">
                <ShieldIcon />
                {c('Info').t`Payments are protected with TLS encryption and Swiss privacy laws`}
            </div>
        )
    ].filter(Boolean);

    return (
        <>
            <Button type="reset">{cancel}</Button>
            {upsells}
            {submit}
        </>
    );
};

NewSubscriptionModalFooter.propTypes = {
    submit: PropTypes.node.isRequired,
    step: PropTypes.number,
    model: PropTypes.object
};

export default NewSubscriptionModalFooter;
