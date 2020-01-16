<<<<<<< HEAD
import { useEffect, useState, useRef } from 'react';
import { createToken } from 'proton-shared/lib/api/payments';
import { useApi, useLoading } from 'react-components';

import { toParams, process } from '../containers/payments/paymentTokenHelper';
=======
import React, { useEffect, useState } from 'react';
import { createToken } from 'proton-shared/lib/api/payments';
import { useApi, useLoading, useModals } from 'react-components';

import PaymentVerificationModal from '../containers/payments/PaymentVerificationModal';
>>>>>>> 9b3797c62424c57bbe721e8c58cc8b62d5b48239

const usePayPal = ({ amount: Amount = 0, currency: Currency = '', type: Type, onPay }) => {
    const api = useApi();
    const [model, setModel] = useState({});
<<<<<<< HEAD
    const abortRef = useRef();
    const [loadingVerification, withLoadingVerification] = useLoading();
    const [loadingToken, withLoadingToken] = useLoading();
    const onCancel = () => abortRef.current && abortRef.current.abort();
=======
    const [loadingVerification, withLoadingVerification] = useLoading();
    const [loadingToken, withLoadingToken] = useLoading();
    const { createModal } = useModals();
>>>>>>> 9b3797c62424c57bbe721e8c58cc8b62d5b48239

    const onToken = async () => {
        const result = await api(
            createToken({
                Amount,
                Currency,
                Payment: { Type }
            })
        );
        setModel(result);
    };

    const onVerification = async () => {
<<<<<<< HEAD
        abortRef.current = new AbortController();
        const { Token, ApprovalURL, ReturnHost } = model;
        await process({ Token, api, ApprovalURL, ReturnHost, signal: abortRef.current.signal });
        onPay(toParams({ Amount, Currency }, Token, Type));
=======
        const { Token, ApprovalURL, ReturnHost } = model;
        const result = await new Promise((resolve, reject) => {
            createModal(
                <PaymentVerificationModal
                    params={{ Amount, Currency }}
                    returnHost={ReturnHost}
                    approvalURL={ApprovalURL}
                    token={Token}
                    onSubmit={resolve}
                    onClose={reject}
                    type={Type}
                />
            );
        });
        onPay(result);
>>>>>>> 9b3797c62424c57bbe721e8c58cc8b62d5b48239
    };

    useEffect(() => {
        if (Amount) {
            withLoadingToken(onToken());
        }
    }, [Amount, Currency]);

    return {
        isReady: !!model.Token,
        loadingToken,
        loadingVerification,
<<<<<<< HEAD
        onCancel,
=======
>>>>>>> 9b3797c62424c57bbe721e8c58cc8b62d5b48239
        onToken: () => withLoadingToken(onToken()),
        onVerification: () => withLoadingVerification(onVerification())
    };
};

export default usePayPal;
