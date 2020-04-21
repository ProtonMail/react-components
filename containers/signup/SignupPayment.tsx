import React from 'react';
import { c } from 'ttag';
import { Alert, Payment, SubscriptionCheckout } from 'react-components';

import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    card: any;
    onCardChange: () => void;
    paypal: any;
    paypalCredit: any;
    method: any;
    onMethodChange: (method: string) => void;
    errors: any;
    canPay: boolean;
}

const SignupPayment = ({ model, card, onCardChange, paypal, paypalCredit, method, onMethodChange, errors }: Props) => {
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
                        amount={model.amount}
                        currency={model.currency}
                        card={card}
                        onMethod={onMethodChange}
                        onCard={onCardChange}
                        errors={errors}
                    />
                </div>
                <div className="w25 onmobile-w100">
                    {/* <SubscriptionCheckout
                        method={method}
                        submit={
                            <NewSubscriptionSubmitButton
                                canPay={canPay}
                                paypal={paypal}
                                method={method}
                                checkResult={checkResult}
                                className="w100"
                            />
                        }
                        plans={plans}
                        checkResult={checkResult}
                        loading={loadingCheck}
                        onCheckout={() => withLoading(handleCheckout())}
                        model={model}
                        setModel={setModel}
                    /> */}
                </div>
            </div>
        </>
    );
};

export default SignupPayment;
