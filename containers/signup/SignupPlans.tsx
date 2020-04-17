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
    const mailPlan = model.planIDs;

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
                currentPlan={c('Status').t`Selected`}
                selected={c('Status').t`Selected`}
                planNameSelected={mailPlan.Name}
                plans={plans}
                cycle={model.cycle}
                currency={model.currency}
                onSelect={(planID: string = '') => {
                    if (planID) {
                        onChange({
                            ...model,
                            planIDs: { [planID]: 1 },
                            step: PAYMENT
                        });
                        return;
                    }
                    onChange({
                        ...model,
                        planIDs: {},
                        step: CREATING_ACCOUNT
                    });
                    onSubmit();
                }}
            />
        </>
    );
};

export default SignupPlans;
