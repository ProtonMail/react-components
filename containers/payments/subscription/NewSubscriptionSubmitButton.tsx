import React from 'react';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import { PrimaryButton } from '../../../components';
import { classnames } from '../../../helpers';

import { SUBSCRIPTION_STEPS } from './constants';
import PayPalButton from '../PayPalButton';
import { SubscriptionCheckResult } from '../../signup/interfaces';
import { PayPalHook } from '../usePayPal';

interface Props {
    className?: string;
    canPay: Boolean;
    step: SUBSCRIPTION_STEPS;
    onClose: () => void;
    checkResult?: SubscriptionCheckResult;
    loading?: boolean;
    method?: PAYMENT_METHOD_TYPES;
    paypal: PayPalHook;
}

const NewSubscriptionSubmitButton = ({
    className,
    paypal,
    canPay,
    step,
    loading,
    method,
    checkResult,
    onClose,
}: Props) => {
    if (step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
        return (
            <PrimaryButton className={className} loading={loading} type="submit">{c('Action')
                .t`Continue`}</PrimaryButton>
        );
    }

    if (checkResult?.AmountDue === 0) {
        return (
            <PrimaryButton className={className} loading={loading} disabled={!canPay} type="submit">{c('Action')
                .t`Confirm`}</PrimaryButton>
        );
    }

    if (method === PAYMENT_METHOD_TYPES.PAYPAL) {
        return (
            <PayPalButton
                paypal={paypal}
                className={classnames(['button--primary', className])}
                amount={checkResult?.AmountDue || 0}
            >{c('Action').t`Pay`}</PayPalButton>
        );
    }

    if ([PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(method)) {
        return (
            <PrimaryButton className={className} loading={loading} onClick={onClose}>{c('Action')
                .t`Done`}</PrimaryButton>
        );
    }

    return (
        <PrimaryButton className={className} loading={loading} disabled={!canPay} type="submit">{c('Action')
            .t`Pay`}</PrimaryButton>
    );
};

export default NewSubscriptionSubmitButton;
