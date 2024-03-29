import React from 'react';
import { PAYMENT_METHOD_TYPE, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import { SubscriptionCheckResponse } from 'proton-shared/lib/interfaces';
import { c } from 'ttag';
import { PrimaryButton } from '../../../components';

import PayPalButton from '../PayPalButton';
import { PayPalHook } from '../usePayPal';

import { SUBSCRIPTION_STEPS } from './constants';

interface Props {
    className?: string;
    canPay: Boolean;
    step: SUBSCRIPTION_STEPS;
    onClose?: () => void;
    checkResult?: SubscriptionCheckResponse;
    loading?: boolean;
    method?: PAYMENT_METHOD_TYPE;
    paypal: PayPalHook;
    disabled?: boolean;
}

const SubscriptionSubmitButton = ({
    className,
    paypal,
    canPay,
    step,
    loading,
    method,
    checkResult,
    disabled,
    onClose,
}: Props) => {
    if (step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
        return (
            <PrimaryButton className={className} disabled={disabled} loading={loading} type="submit">{c('Action')
                .t`Continue`}</PrimaryButton>
        );
    }

    if (checkResult?.AmountDue === 0) {
        return (
            <PrimaryButton className={className} loading={loading} disabled={disabled || !canPay} type="submit">{c(
                'Action'
            ).t`Confirm`}</PrimaryButton>
        );
    }

    if (method === PAYMENT_METHOD_TYPES.PAYPAL) {
        return (
            <PayPalButton
                type="subscription"
                paypal={paypal}
                color="norm"
                className={className}
                amount={checkResult?.AmountDue || 0}
            >{c('Action').t`Pay`}</PayPalButton>
        );
    }

    if (!loading && method && [PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(method as any)) {
        return (
            <PrimaryButton className={className} disabled={disabled} loading={loading} onClick={onClose}>{c('Action')
                .t`Done`}</PrimaryButton>
        );
    }

    return (
        <PrimaryButton className={className} loading={loading} disabled={disabled || !canPay} type="submit">{c('Action')
            .t`Pay`}</PrimaryButton>
    );
};

export default SubscriptionSubmitButton;
