import { useEffect, useState } from 'react';
import { c } from 'ttag';
import { BLACK_FRIDAY, PAYMENT_METHOD_TYPES, MIN_BITCOIN_AMOUNT, MIN_PAYPAL_AMOUNT } from 'proton-shared/lib/constants';
import { isExpired } from 'proton-shared/lib/helpers/card';
import { getPaymentMethodStatus, queryPaymentMethods } from 'proton-shared/lib/api/payments';
import { PaymentMethod, PaymentStatus } from 'proton-shared/lib/interfaces';

import { useApi, useLoading, useAuthentication } from '../../hooks';

type PaymentFlow = 'signup' | 'subscription' | 'invoice' | 'donation' | 'credit' | 'human-verification';

interface Props {
    amount?: number;
    coupon?: string;
    flow: PaymentFlow;
}

const useMethods = ({ amount = 0, coupon, flow }: Props) => {
    const api = useApi();
    const { UID } = useAuthentication();
    const isAuthenticated = !!UID;
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, withLoading] = useLoading();
    const [status, setStatus] = useState<PaymentStatus>();

    const isPaypalAmountValid = amount >= MIN_PAYPAL_AMOUNT;
    const isInvoice = flow === 'invoice';
    const isSignup = flow === 'signup';
    const isHumanVerification = flow === 'human-verification';
    const alreadyHavePayPal = methods.some(({ Type }) => Type === PAYMENT_METHOD_TYPES.PAYPAL);

    const getMethod = (paymentMethod: PaymentMethod) => {
        switch (paymentMethod.Type) {
            case PAYMENT_METHOD_TYPES.CARD:
                return `${paymentMethod.Details?.Brand} - ${paymentMethod.Details?.Last4}`;
            case PAYMENT_METHOD_TYPES.PAYPAL:
                return `PayPal - ${paymentMethod.Details?.PayerID}`;
            default:
                return '';
        }
    };

    const getIcon = (paymentMethod: PaymentMethod) => {
        if (
            paymentMethod.Type === PAYMENT_METHOD_TYPES.PAYPAL ||
            paymentMethod.Type === PAYMENT_METHOD_TYPES.PAYPAL_CREDIT
        ) {
            return 'payments-type-pp';
        }
        if (paymentMethod.Type === PAYMENT_METHOD_TYPES.CARD) {
            switch (paymentMethod.Details.Brand) {
                case 'American Express':
                    return 'payments-type-amex';
                case 'Visa':
                    return 'payments-type-visa';
                case 'Discover':
                    return 'payments-type-discover';
                case 'MasterCard':
                    return 'payments-type-mastercard';
                default:
                    return 'payments-type-card';
            }
        }
        return '';
    };

    const options = [];

    if (status?.Card) {
        options.push({
            icon: 'payments-type-card',
            value: PAYMENT_METHOD_TYPES.CARD,
            text: c('Payment method option').t`Credit/debit card`,
        });
    }

    if (methods.length) {
        options.unshift(
            ...methods.map((paymentMethod) => {
                const expired = isExpired(paymentMethod.Details as any);
                return {
                    icon: getIcon(paymentMethod),
                    text: [getMethod(paymentMethod), expired && `(${c('Info').t`Expired`})`].filter(Boolean).join(' '),
                    value: paymentMethod.ID,
                    disabled: expired,
                };
            })
        );
    }

    if (status?.Paypal && !alreadyHavePayPal && (isPaypalAmountValid || isInvoice)) {
        options.push({
            icon: 'payments-type-pp',
            text: c('Payment method option').t`PayPal`,
            value: PAYMENT_METHOD_TYPES.PAYPAL,
        });
    }

    if (
        status?.Bitcoin &&
        !isSignup &&
        !isHumanVerification &&
        coupon !== BLACK_FRIDAY.COUPON_CODE &&
        amount >= MIN_BITCOIN_AMOUNT
    ) {
        options.push({
            icon: 'payments-type-bt',
            text: c('Payment method option').t`Bitcoin`,
            value: 'bitcoin',
        });
    }

    if (status?.Cash && !isSignup && !isHumanVerification && coupon !== BLACK_FRIDAY.COUPON_CODE) {
        options.push({
            icon: 'payments-type-cash',
            text: c('Label').t`Cash`,
            value: 'cash',
        });
    }

    const loadPaymentStatus = async () => {
        const result = await api(getPaymentMethodStatus());
        setStatus(result as PaymentStatus);
    };

    const loadPaymentMethods = async () => {
        const { PaymentMethods } = await api(queryPaymentMethods());
        setMethods(PaymentMethods);
    };

    useEffect(() => {
        const promises = [loadPaymentStatus()];
        if (isAuthenticated) {
            promises.push(loadPaymentMethods());
        }
        void withLoading(Promise.all(promises));
    }, []);

    return {
        methods,
        loading,
        options,
    };
};

export default useMethods;
