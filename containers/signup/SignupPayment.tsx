import React from 'react';
import { c } from 'ttag';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

import { Alert, Payment, SubscriptionCheckout } from '../../index';
import { SignupModel, SignupPlan, SignupPayPal, SubscriptionCheckResult } from './interfaces';
import SignupCheckoutButton from './SignupCheckoutButton';

interface Props {
    model: SignupModel;
    checkResult: SubscriptionCheckResult;
    onChange: (model: SignupModel) => void;
    card: any;
    onCardChange: (key: string, value: string) => void;
    paypal: SignupPayPal;
    paypalCredit: SignupPayPal;
    method: any;
    onMethodChange: (method: PAYMENT_METHOD_TYPES) => void;
    errors: any;
    canPay: boolean;
    loading: boolean;
    plans: SignupPlan[];
}

const SignupPayment = ({
    plans,
    checkResult,
    model,
    onChange,
    card,
    onCardChange,
    paypal,
    paypalCredit,
    canPay,
    method,
    onMethodChange,
    errors,
    loading
}: Props) => {
    return (
        <>
            <Alert>{c('Info')
                .t`You can use any of your saved payment method or add a new one. Please note that depending on the total amount due, some payment options may not be available.`}</Alert>
            <div className="flex flex-spacebetween onmobile-flex-column">
                <div className="w75 onmobile-w100 pr1 onmobile-pr0">
                    <Payment
                        type="signup"
                        paypal={paypal}
                        paypalCredit={paypalCredit}
                        method={method}
                        amount={checkResult.AmountDue}
                        currency={model.currency}
                        card={card}
                        onMethod={onMethodChange}
                        onCard={onCardChange}
                        errors={errors}
                    />
                </div>
                <div className="w25 onmobile-w100">
                    <SubscriptionCheckout
                        method={method}
                        submit={
                            <SignupCheckoutButton
                                loading={loading}
                                canPay={canPay}
                                paypal={paypal}
                                method={method}
                                checkResult={checkResult}
                                className="w100"
                            />
                        }
                        plans={plans}
                        checkResult={checkResult}
                        loading={loading}
                        model={model}
                        setModel={onChange}
                    />
                </div>
            </div>
        </>
    );
};

export default SignupPayment;
