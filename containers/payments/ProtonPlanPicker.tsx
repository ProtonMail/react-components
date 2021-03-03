import React from 'react';
import { c } from 'ttag';
import { Cycle, Currency, Plan, Organization, Subscription } from 'proton-shared/lib/interfaces';
import {
    CYCLE,
    PLANS,
    PLAN_SERVICES,
    APPS,
    PLAN_TYPES,
    DEFAULT_CURRENCY,
    DEFAULT_CYCLE,
} from 'proton-shared/lib/constants';
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

const FREE_PLAN = {
    ID: 'free',
    Name: 'free' as PLANS,
    Title: 'Free',
    Type: PLAN_TYPES.PLAN,
    Currency: DEFAULT_CURRENCY,
    Cycle: DEFAULT_CYCLE,
    Amount: 0,
    MaxDomains: 0,
    MaxAddresses: 0,
    MaxSpace: 0,
    MaxMembers: 0,
    MaxVPN: 0,
    MaxTier: 0,
    Services: PLAN_SERVICES.MAIL + PLAN_SERVICES.VPN,
    Quantity: 1,
    Features: 0,
    Pricing: {
        [CYCLE.MONTHLY]: 0,
        [CYCLE.YEARLY]: 0,
        [CYCLE.TWO_YEARS]: 0,
    },
} as Plan;

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
    const planNamesMap = toMap(plans, 'Name');
    const MailPlans: Plan[] = [
        FREE_PLAN,
        planNamesMap[PLANS.PLUS],
        planNamesMap[PLANS.PROFESSIONAL],
        planNamesMap[PLANS.VISIONARY],
    ];
    const VPNPlans: Plan[] = [FREE_PLAN, planNamesMap[PLANS.VPNBASIC], planNamesMap[PLANS.VPNPLUS]];
    const currentPlan = subscription ? getPlan(subscription, service) : null;
    const plansToShow = service === PLAN_SERVICES.VPN ? VPNPlans : MailPlans;
    const yourPlanText = c('Plan info').t`(Your plan)`;

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
                {plansToShow.map((plan) => {
                    const isFree = plan.ID === FREE_PLAN.ID;
                    const isCurrentPlan = currentPlan?.ID === plan.ID;
                    const checked = isFree ? plansToShow.every((plan) => !planIDs[plan.ID]) : !!planIDs[plan.ID];
                    return (
                        <li key={plan.ID}>
                            <Radio
                                checked={checked}
                                name={`plan${service}`}
                                className="flex flex-nowrap"
                                id={`${plan.ID}${service}`}
                                onChange={() => {
                                    onChangePlanIDs(
                                        switchPlan({
                                            planIDs,
                                            plans,
                                            planID: isFree ? undefined : plan.ID,
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
                                {isFree ? (
                                    <span>{c('Free price').t`Free`}</span>
                                ) : (
                                    <Price currency={currency} suffix={c('Suffix for price').t`/ month`}>
                                        {plan.Pricing[cycle] / cycle}
                                    </Price>
                                )}
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
