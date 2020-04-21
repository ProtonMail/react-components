import React, { useEffect, useState } from 'react';
import { createToken } from 'proton-shared/lib/api/payments';
import { useApi, useLoading, useModals, useDebounceInput } from 'react-components';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

import PaymentVerificationModal from '../containers/payments/PaymentVerificationModal';
import { process } from '../containers/payments/paymentTokenHelper';

interface Props {
    isActive: boolean;
    amount: number;
    currency: string;
    type: PAYMENT_METHOD_TYPES.PAYPAL | PAYMENT_METHOD_TYPES.PAYPAL_CREDIT;
    onPay: (data: any) => void;
}

interface Model {
    Token: string;
    ApprovalURL: string;
    ReturnHost: string;
}

const DEFAULT_MODEL = {
    Token: '',
    ApprovalURL: '',
    ReturnHost: ''
};

const usePayPal = ({ isActive, amount = 0, currency: Currency = '', type: Type, onPay }: Props) => {
    const api = useApi();
    const [model, setModel] = useState<Model>(DEFAULT_MODEL);
    const [loadingVerification, withLoadingVerification] = useLoading();
    const [loadingToken, withLoadingToken] = useLoading();
    const { createModal } = useModals();
    const debouncedAmount = useDebounceInput(amount);

    const onToken = async () => {
        const result = await api(
            createToken({
                Amount: debouncedAmount,
                Currency,
                Payment: { Type }
            })
        );
        setModel(result);
    };

    const onVerification = async () => {
        const { Token, ApprovalURL, ReturnHost } = model;
        const result = await new Promise((resolve, reject) => {
            const onProcess = () => {
                const abort = new AbortController();
                return {
                    promise: process({
                        Token,
                        api,
                        ReturnHost,
                        ApprovalURL,
                        signal: abort.signal
                    }),
                    abort
                };
            };
            createModal(
                <PaymentVerificationModal
                    params={{ Amount: debouncedAmount, Currency }}
                    token={Token}
                    onSubmit={resolve}
                    onClose={reject}
                    type={Type}
                    onProcess={onProcess}
                    initialProcess={onProcess()}
                />
            );
        });
        onPay(result);
    };

    useEffect(() => {
        if (isActive && debouncedAmount) {
            withLoadingToken(onToken());
        }
    }, [isActive, debouncedAmount, Currency]);

    return {
        isReady: !!model.Token,
        loadingToken,
        loadingVerification,
        onToken: () => withLoadingToken(onToken()),
        onVerification: () => withLoadingVerification(onVerification())
    };
};

export default usePayPal;
