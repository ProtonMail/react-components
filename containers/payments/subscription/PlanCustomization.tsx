import React from 'react';
import { Currency, Cycle, Organization, Plan, PlanIDs, Subscription } from 'proton-shared/lib/interfaces';
import { PLAN_SERVICES } from 'proton-shared/lib/constants';

import ProtonPlanPicker from '../ProtonPlanPicker';
import ProtonPlanCustomizer from '../ProtonPlanCustomizer';

interface Props {
    plans: Plan[];
    cycle: Cycle;
    currency: Currency;
    service: PLAN_SERVICES;
    planIDs: PlanIDs;
    subscription?: Subscription;
    organization?: Organization;
    loading?: boolean;
    onChangePlanIDs: (newPlanIDs: PlanIDs) => void;
    onChangeCycle: (newCycle: Cycle) => void;
    onBack: () => void;
}

const PlanCustomization = ({
    plans,
    planIDs,
    cycle,
    currency,
    service,
    onChangePlanIDs,
    onChangeCycle,
    onBack,
    loading,
    organization,
    subscription,
}: Props) => {
    return (
        <>
            <ProtonPlanPicker
                subscription={subscription}
                organization={organization}
                plans={plans}
                service={service}
                planIDs={planIDs}
                cycle={cycle}
                currency={currency}
                onChangeCycle={onChangeCycle}
                onChangePlanIDs={onChangePlanIDs}
                onBack={onBack}
            />
            <hr className="mt2 mb2 border-bottom" />
            <ProtonPlanCustomizer
                loading={loading}
                cycle={cycle}
                currency={currency}
                plans={plans}
                planIDs={planIDs}
                service={service}
                organization={organization}
                onChangePlanIDs={onChangePlanIDs}
            />
            <hr className="mt2 mb2 border-bottom" />
            <ProtonPlanPicker
                subscription={subscription}
                organization={organization}
                plans={plans}
                service={service === PLAN_SERVICES.MAIL ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL}
                planIDs={planIDs}
                cycle={cycle}
                currency={currency}
                onChangeCycle={onChangeCycle}
                onChangePlanIDs={onChangePlanIDs}
                onBack={onBack}
            />
            <hr className="mt2 mb2 border-bottom" />
            <ProtonPlanCustomizer
                loading={loading}
                cycle={cycle}
                currency={currency}
                plans={plans}
                planIDs={planIDs}
                service={service === PLAN_SERVICES.MAIL ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL}
                organization={organization}
                onChangePlanIDs={onChangePlanIDs}
            />
        </>
    );
};

export default PlanCustomization;
