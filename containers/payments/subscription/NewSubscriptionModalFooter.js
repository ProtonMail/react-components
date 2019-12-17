import React from 'react';
import PropTypes from 'prop-types';
import { useAddresses, Button, Loader } from 'react-components';
import { c } from 'ttag';
import { CYCLE, COUPON_CODES } from 'proton-shared/lib/constants';
import checkmarkSvg from 'design-system/assets/img/shared/checkmark-icon.svg';
import percentageSvg from 'design-system/assets/img/shared/percentage-icon.svg';

const STEPS = {
    CUSTOMIZATION: 0,
    PAYMENT: 1,
    UPGRADE: 2,
    THANKS: 3
};

const CheckmarkIcon = () => <img className="mr0-5" src={checkmarkSvg} alt="checkmark" />;
const PercentageIcon = () => <img className="mr0-5" src={percentageSvg} alt="percentage" />;

const NewSubscriptionModalFooter = ({ submit, step, model }) => {
    const [addresses, loadingAddresses] = useAddresses();

    if ([STEPS.UPGRADE, STEPS.THANKS].includes(step)) {
        return null;
    }

    if (loadingAddresses) {
        return <Loader />;
    }

    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const cancel = step === STEPS.CUSTOMIZATION ? c('Action').t`Cancel` : c('Action').t`Back`;
    const upsells = [
        model.cycle === CYCLE.MONTHLY && (
            <div key="upsell-1" className="nomobile">
                <PercentageIcon />
                {c('Info').t`Save 20% by switching to annual billing`}
            </div>
        ),
        model.cycle === CYCLE.YEARLY && (
            <div key="upsell-2" className="nomobile">
                <CheckmarkIcon />
                {c('Info').t`You are saving 20% with annual billing`}
            </div>
        ),
        model.cycle === CYCLE.TWO_YEARS && (
            <div key="upsell-3" className="nomobile">
                <CheckmarkIcon />
                {c('Info').t`You are saving 33% with 2-year billing`}
            </div>
        ),
        hasAddresses && model.coupon !== COUPON_CODES.BUNDLE && (
            <div key="upsell-4" className="nomobile">
                <PercentageIcon />
                {c('Info').t`Save an extra 20% by combining Mail and VPN`}
            </div>
        ),
        hasAddresses && model.coupon === COUPON_CODES.BUNDLE && (
            <div key="upsell-5" className="nomobile">
                <CheckmarkIcon />
                {c('Info').t`You are saving an extra 20% with the bundle discount`}
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
