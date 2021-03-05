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
    onBack: (service: PLAN_SERVICES) => void;
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
    const services =
        service === PLAN_SERVICES.MAIL
            ? [PLAN_SERVICES.MAIL, PLAN_SERVICES.VPN]
            : [PLAN_SERVICES.VPN, PLAN_SERVICES.MAIL];

    return services.map((service, index) => {
        return (
            <>
                <ProtonPlanPicker
                    index={index}
                    subscription={subscription}
                    organization={organization}
                    plans={plans}
                    service={service}
                    planIDs={planIDs}
                    cycle={cycle}
                    currency={currency}
                    onChangeCycle={onChangeCycle}
                    onChangePlanIDs={onChangePlanIDs}
                    onBack={() => onBack(service)}
                />
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
            </>
        );
    });
};

export default PlanCustomization;
