import { useEffect, useState, useRef } from 'react';
import { createToken } from 'proton-shared/lib/api/payments';
import { useApi, useLoading } from 'react-components';

import { toParams, process } from '../containers/payments/paymentTokenHelper';

const usePayPal = ({ amount: Amount = 0, currency: Currency = '', type: Type, onPay }) => {
    const api = useApi();
    const [model, setModel] = useState({});
    const abortRef = useRef();
    const [loadingVerification, withLoadingVerification] = useLoading();
    const [loadingToken, withLoadingToken] = useLoading();
    const onCancel = () => abortRef.current && abortRef.current.abort();

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
        abortRef.current = new AbortController();
        const { Token, ApprovalURL, ReturnHost } = model;
        await process({ Token, api, ApprovalURL, ReturnHost, signal: abortRef.current.signal });
        onPay(toParams({ Amount, Currency }, Token, Type));
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
        onCancel,
        onToken: () => withLoadingToken(onToken()),
        onVerification: () => withLoadingVerification(onVerification())
    };
};

export default usePayPal;
