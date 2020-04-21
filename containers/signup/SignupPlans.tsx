import React from 'react';
import { MailSubscriptionTable, CycleSelector, CurrencySelector } from 'react-components';
import { c } from 'ttag';

import { SignupModel, SignupPlan } from './interfaces';
import { SIGNUP_STEPS } from './constants';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: () => void;
    loading: boolean;
    plans?: SignupPlan[];
}

const { PAYMENT, CREATING_ACCOUNT } = SIGNUP_STEPS;

const SignupPlans = ({ plans = [], model, onChange, loading, onSubmit }: Props) => {
    return (
        <>
            <div className="mb1">
                <CycleSelector cycle={model.cycle} onSelect={(cycle: number) => onChange({ ...model, cycle })} />
                <CurrencySelector
                    currency={model.currency}
                    onSelect={(currency: string) => onChange({ ...model, currency })}
                />
            </div>
            <MailSubscriptionTable
                disabled={loading}
                mode="button"
                selected={c('Status').t`Selected`}
                plans={plans}
                cycle={model.cycle}
                currency={model.currency}
                onSelect={(planID: string = '') => {
                    const plan = plans.find(({ ID }: SignupPlan) => ID === planID);
                    if (plan) {
                        onChange({
                            ...model,
                            planIDs: { [plan.ID]: 1 },
                            amount: plan.Pricing[model.cycle],
                            step: PAYMENT
                        });
                        return;
                    }
                    // Pick free plan
                    onChange({
                        ...model,
                        planIDs: {},
                        amount: 0,
                        step: CREATING_ACCOUNT
                    });
                    onSubmit();
                }}
            />
        </>
    );
};

export default SignupPlans;
