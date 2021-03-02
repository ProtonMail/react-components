import React from 'react';
import { c } from 'ttag';
import { Cycle, Currency, Plan, Organization, Subscription } from 'proton-shared/lib/interfaces';
import { CYCLE, PLANS, PLAN_SERVICES, APPS, PLAN_TYPES } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { switchPlan, getPlan } from 'proton-shared/lib/helpers/subscription';
import { getAppName } from 'proton-shared/lib/apps/helper';

import { Radio, Button, InlineLinkButton, Price } from '../../components';
import { PlanIDs } from '../signup/interfaces';

interface Props {
    cycle: Cycle;
    currency: Currency;
    onChangePlanIDs: (planIDs: PlanIDs) => void;
    onChangeCycle: (cycle: Cycle) => void;
    onBack: () => void;
    planIDs: PlanIDs;
    plans: Plan[];
    organization?: Organization;
    service: PLAN_SERVICES;
    subscription?: Subscription;
}

const MailPlans: PLANS[] = [PLANS.PLUS, PLANS.PROFESSIONAL, PLANS.VISIONARY];
const VPNPlans: PLANS[] = [PLANS.VPNBASIC, PLANS.VPNPLUS];

const ProtonPlanPicker = ({
    cycle,
    currency,
    onChangePlanIDs,
    onChangeCycle,
    onBack,
    planIDs,
    plans,
    organization,
    service,
    subscription,
}: Props) => {
    const vpnAppName = getAppName(APPS.PROTONVPN_SETTINGS);
    const mailAppName = getAppName(APPS.PROTONMAIL);
    const plansMap = toMap(plans);
    const planNamesMap = toMap(plans, 'Name');
    const currentPlan = subscription ? getPlan(subscription, service) : null;
    const plansToShow = service === PLAN_SERVICES.VPN ? VPNPlans : MailPlans;
    const isFree = !Object.entries(planIDs).some(([planID, planQuantity]) => {
        if (!planQuantity) {
            return false;
        }
        const { Type, Services } = plansMap[planID];
        return Type === PLAN_TYPES.PLAN && Services & service;
    });
    const yourPlanText = c('Plan info').t`(Your plan)`;
    const isCurrentFreePlan = !currentPlan;

    const annualBilling = (
        <InlineLinkButton key="annual-billing" onClick={() => onChangeCycle(CYCLE.YEARLY)}>{c('Action')
            .t`annual billing`}</InlineLinkButton>
    );
    return (
        <>
            <h3>{service === PLAN_SERVICES.VPN ? vpnAppName : mailAppName} plan</h3>
            {cycle === CYCLE.MONTHLY ? (
                <p>{c('Info').jt`Save 20% on your susbcription by switching to ${annualBilling}`}</p>
            ) : null}
            {service === PLAN_SERVICES.MAIL ? (
                <p>
                    {c('Info').t`${mailAppName} Free is included in your plan.`}
                    <br />
                    {c('Info').t`Save 20% on both Mail and VPN by adding a Mail subscription.`}
                </p>
            ) : null}
            {service === PLAN_SERVICES.VPN ? (
                <p>
                    {c('Info').t`${vpnAppName} Free is included in your plan.`}
                    <br />
                    {c('Info').t`Save 20% on both VPN and Mail by adding a VPN subscription.`}
                </p>
            ) : null}
            <ul>
                <li>
                    <Radio
                        checked={!!isFree}
                        name="plan"
                        className="flex flex-nowrap"
                        id="free-plan"
                        onChange={() => {
                            onChangePlanIDs(
                                switchPlan({
                                    planIDs,
                                    plans,
                                    planID: undefined,
                                    service,
                                    organization,
                                })
                            );
                        }}
                    >
                        <span className="flex-item-fluid">Free{isCurrentFreePlan ? ` ${yourPlanText}` : ''}</span>
                        <span>{c('Free price').t`Free`}</span>
                    </Radio>
                </li>
                {plansToShow.map((planName) => {
                    const plan = planNamesMap[planName];
                    if (!plan) {
                        return null;
                    }
                    const isCurrentPlan = currentPlan?.ID === plan.ID;
                    return (
                        <li key={plan.ID}>
                            <Radio
                                checked={!!planIDs[plan.ID]}
                                name="plan"
                                className="flex flex-nowrap"
                                id={plan.ID}
                                onChange={() => {
                                    onChangePlanIDs(
                                        switchPlan({
                                            planIDs,
                                            plans,
                                            planID: plan.ID,
                                            service,
                                            organization,
                                        })
                                    );
                                }}
                            >
                                <span className="flex-item-fluid">
                                    {plan.Title}
                                    {isCurrentPlan ? ` ${yourPlanText}` : ''}
                                </span>
                                <Price currency={currency} suffix={c('Suffix for price').t`/ month`}>
                                    {plan.Pricing[cycle] / cycle}
                                </Price>
                            </Radio>
                        </li>
                    );
                })}
            </ul>
            <Button onClick={() => onBack()}>{c('Action').t`Compare plans`}</Button>
        </>
    );
};

export default ProtonPlanPicker;
