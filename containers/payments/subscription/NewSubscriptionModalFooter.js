import React from 'react';
import PropTypes from 'prop-types';
import { useAddresses, Icon, Button, PrimaryButton, Loader } from 'react-components';
import { c } from 'ttag';
import { CYCLE, COUPON_CODES } from 'proton-shared/lib/constants';

const STEPS = {
    CUSTOMIZATION: 0,
    PAYMENT: 1,
    UPGRADE: 2,
    THANKS: 3
};

const NewSubscriptionModalFooter = ({ submit, step, model, loading }) => {
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
            <div className="nomobile">
                <Icon className="mr0-5" fill="warning" name="off" />
                {c('Info').t`Save 20% by switching to annual billing`}
            </div>
        ),
        model.cycle === CYCLE.YEARLY && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving 20% with annual billing`}
            </div>
        ),
        model.cycle === CYCLE.TWO_YEARS && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving 33% with 2-year billing`}
            </div>
        ),
        hasAddresses && model.coupon !== COUPON_CODES.BUNDLE && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="warning" name="off" />
                {c('Info').t`Save an extra 20% by combining Mail and VPN`}
            </div>
        ),
        hasAddresses && model.coupon === COUPON_CODES.BUNDLE && (
            <div className="nomobile">
                <Icon className="mr0-5" fill="success" name="on" />
                {c('Info').t`You are saving an extra 20% with the bundle discount`}
            </div>
        )
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

NewSubscriptionModalFooter.propTypes = {
    submit: PropTypes.string,
    loading: PropTypes.bool,
    step: PropTypes.number,
    model: PropTypes.object
};

export default NewSubscriptionModalFooter;
