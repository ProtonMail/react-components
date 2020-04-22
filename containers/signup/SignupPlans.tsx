import React from 'react';
import { MailSubscriptionTable, CycleSelector, CurrencySelector } from 'react-components';
import { c } from 'ttag';

import { SignupModel, SignupPlan } from './interfaces';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSelectPlan: (planID: string) => void;
    loading: boolean;
    plans?: SignupPlan[];
}

const SignupPlans = ({ plans = [], model, onChange, onSelectPlan, loading }: Props) => {
    return (
        <>
            <h1 className="h2">{c('Title').t`Choose a plan`}</h1>
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
                onSelect={onSelectPlan}
            />
        </>
    );
};

export default SignupPlans;
