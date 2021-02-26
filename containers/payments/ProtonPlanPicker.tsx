import React from 'react';
import { c } from 'ttag';
import { Cycle, Currency, Plan, Organization, Subscription } from 'proton-shared/lib/interfaces';
import { CYCLE, PLANS, PLAN_SERVICES, APPS } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { switchPlan, getPlan } from 'proton-shared/lib/helpers/subscription';
import { getAppName } from 'proton-shared/lib/apps/helper';

import { Radio, Button, InlineLinkButton, Price } from '../../components';
import { useConfig } from '../../hooks';
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

const MailPlans: PLANS[] = [PLANS.PLUS, PLANS.PROFESSIONAL];
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
    const { APP_NAME } = useConfig();

    const vpnAppName = getAppName(APPS.PROTONVPN_SETTINGS);
    const mailAppName = getAppName(APPS.PROTONMAIL);
    const currentPlan = subscription ? getPlan(subscription, service) : null;

    const isVpnApp = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const plansToShow = isVpnApp ? VPNPlans : MailPlans;
    if ((isVpnApp && service === PLAN_SERVICES.VPN) || (!isVpnApp && service === PLAN_SERVICES.MAIL)) {
        plansToShow.push(PLANS.VISIONARY);
    }
    const isFree = plansToShow.every((planName) => !planIDs[planName]);
    const yourPlanText = c('Plan info').t`Your plan`;
    const isCurrentFreePlan = !currentPlan;

    const plansMap = toMap(plans, 'Name');
    const annualBilling = (
        <InlineLinkButton key="annual-billing" onClick={() => onChangeCycle(CYCLE.YEARLY)}>{c('Action')
            .t`annual billing`}</InlineLinkButton>
    );
    return (
        <>
            <h3>{isVpnApp ? vpnAppName : mailAppName} plan</h3>
            {cycle === CYCLE.MONTHLY ? (
                <p>{c('Info').t`Save 20% on your susbcription by switching to ${annualBilling}`}</p>
            ) : null}
            {isVpnApp && service === PLAN_SERVICES.MAIL ? (
                <p>
                    {c('Info').t`${vpnAppName} Free is included in your plan.`}
                    <br />
                    {c('Info').t`Save 20% on both VPN and Mail by adding a Mail subscription.`}
                </p>
            ) : null}
            {!isVpnApp && service === PLAN_SERVICES.VPN ? (
                <p>
                    {c('Info').t`${mailAppName} Free is included in your plan.`}
                    <br />
                    {c('Info').t`Save 20% on both Mail and VPN by adding a VPN subscription.`}
                </p>
            ) : null}
            <Radio
                checked={isFree}
                name="plan"
                className="mr1"
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

            {plansToShow.map((planName) => {
                const plan = plansMap[planName];
                if (!plan) {
                    return null;
                }
                const isCurrentPlan = currentPlan?.ID === plan.ID;

                return (
                    <Radio
                        checked={!!planIDs[plan.ID]}
                        name="plan"
                        className="mr1"
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
                );
            })}
            <Button onClick={() => onBack()}>{c('Action').t`Compare plans`}</Button>
        </>
    );
};

export default ProtonPlanPicker;
