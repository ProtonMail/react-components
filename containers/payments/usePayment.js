import { useState } from 'react';

const usePayment = () => {
    const [method, setMethod] = useState('');
    const [parameters, setParameters] = useState({});
    const [isCardValid, setCardValidity] = useState(false);

    const hasToken = () => {
        const { Payment = {} } = parameters;
        const { Details = {} } = Payment;
        const { Token } = Details;
        return !!Token;
    };

    const canPay = () => {
        if (['bitcoin', 'cash'].includes(method)) {
            return false;
        }

        if (method === 'card' && !isCardValid) {
            return false;
        }

        if (method === 'paypal' && !hasToken()) {
            return false;
        }

        return true;
    };

    return {
        method,
        setMethod,
        parameters,
        setParameters,
        canPay: canPay(),
        setCardValidity
    };
};

export default usePayment;
