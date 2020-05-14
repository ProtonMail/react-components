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
        <div className="pl2 pr2 pb1">
            <div className="flex flex-nowrap flex-items-center onmobile-flex-column">
                <h1 className="h2 mb0 flex-item-fluid onmobile-mb1">{c('Title').t`Choose a plan`}</h1>
                <div className="account-form-cycle-currency-selectors flex flex-nowrap">
                    <CycleSelector
                        className="mr1"
                        cycle={model.cycle}
                        onSelect={(cycle: number) => onChange({ ...model, cycle })}
                    />
                    <CurrencySelector
                        currency={model.currency}
                        onSelect={(currency: string) => onChange({ ...model, currency })}
                    />
                </div>
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
        </div>
    );
};

export default SignupPlans;
