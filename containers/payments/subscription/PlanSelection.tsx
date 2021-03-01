import React from 'react';
import { c } from 'ttag';
import { Currency, Cycle, Organization, Plan, PlanIDs, Subscription } from 'proton-shared/lib/interfaces';
import { toMap } from 'proton-shared/lib/helpers/object';
import { PLANS, PLAN_TYPES, PLAN_SERVICES, CYCLE, DEFAULT_CYCLE, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';
import { switchPlan } from 'proton-shared/lib/helpers/subscription';

import PlanCard from './PlanCard';
import { CycleSelector, CurrencySelector } from '..';
import { Icon, InlineLinkButton } from '../../../components';

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
        1: 0,
        12: 0,
        24: 0,
    },
} as Plan;

interface Props {
    planIDs: PlanIDs;
    currency: Currency;
    cycle: Cycle;
    plans: Plan[];
    service: PLAN_SERVICES;
    subscription?: Subscription;
    organization?: Organization;
    loading?: boolean;
    onChangePlanIDs: (newPlanIDs: PlanIDs) => void;
    onChangeCycle: (newCycle: Cycle) => void;
    onChangeCurrency: (newCurrency: Currency) => void;
}

const PlanSelection = ({
    planIDs,
    plans,
    cycle,
    currency,
    service,
    loading,
    subscription,
    organization,
    onChangePlanIDs,
    onChangeCycle,
    onChangeCurrency,
}: Props) => {
    const isVpnApp = service === PLAN_SERVICES.VPN;
    const plansMap = toMap(plans, 'Name');

    const MailPlans = [FREE_PLAN, plansMap[PLANS.PLUS], plansMap[PLANS.PROFESSIONAL], plansMap[PLANS.VISIONARY]];
    const VPNPlans = [FREE_PLAN, plansMap[PLANS.VPNBASIC], plansMap[PLANS.VPNPLUS], plansMap[PLANS.VISIONARY]];

    const INFO = {
        free: c('Info').t`The basic for private and secure communications.`,
        [PLANS.PLUS]: c('Info').t`Full-featured mailbox with advanced protection.`,
        [PLANS.PROFESSIONAL]: c('Info').t`ProtonMail for professionals and businesses.`,
        [PLANS.VISIONARY]: c('Info').t`ProtonMail for families and small businesses.`,
    };

    const FEATURES = {
        free: [
            c('Plan feature').t`1 user`,
            c('Plan feature').t`0.5 GB storage`,
            c('Plan feature').t`1 address`,
            c('Plan feature').t`3 folders / labels`,
            c('Plan feature').t`No custom email addresses`,
        ],
        [PLANS.PLUS]: [
            c('Plan feature').t`1 user`,
            c('Plan feature').t`5 GB storage *`,
            c('Plan feature').t`5 addresses`,
            c('Plan feature').t`200 folders / labels`,
            c('Plan feature').t`Custom email addresses`,
        ],
        [PLANS.PROFESSIONAL]: [
            c('Plan feature').t`1 - 5000 users *`,
            c('Plan feature').t`5 GB storage / user`,
            c('Plan feature').t`5 addresses / user`,
            c('Plan feature').t`Unlimited folders / labels`,
            c('Plan feature').t`Custom email addresses`,
        ],
        [PLANS.VISIONARY]: [
            c('Plan feature').t`6 users`,
            c('Plan feature').t`20 GB storage`,
            c('Plan feature').t`50 addresses`,
            c('Plan feature').t`Unlimited folders / labels`,
            c('Plan feature').t`Custom email addresses`,
        ],
    };

    return (
        <>
            <div className="mb1">
                <CycleSelector
                    cycle={cycle}
                    onSelect={onChangeCycle}
                    className="mr1"
                    disabled={loading}
                    options={[
                        { text: c('Billing cycle option').t`Monthly`, value: CYCLE.MONTHLY },
                        { text: c('Billing cycle option').t`Annually SAVE 20%`, value: CYCLE.YEARLY },
                        { text: c('Billing cycle option').t`Two years SAVE 33%`, value: CYCLE.TWO_YEARS },
                    ]}
                />
                <CurrencySelector currency={currency} onSelect={onChangeCurrency} disabled={loading} />
            </div>
            {(isVpnApp ? VPNPlans : MailPlans).map((plan: Plan) => {
                const isSelected = subscription?.Plans.some(({ ID }) => ID === plan.ID);
                return (
                    <PlanCard
                        isSelected={isSelected}
                        key={plan.ID}
                        action={c('Action').t`Select plan`}
                        planName={plan.Name}
                        currency={currency}
                        cycle={cycle}
                        price={plan.Pricing[cycle]}
                        info={INFO[plan.Name]}
                        features={FEATURES[plan.Name]}
                        onClick={() =>
                            onChangePlanIDs(
                                switchPlan({
                                    planIDs,
                                    plans,
                                    planID: plan.ID === FREE_PLAN.ID ? undefined : plan.ID,
                                    service,
                                    organization,
                                })
                            )
                        }
                    />
                );
            })}
            <p className="text-sm">{c('Info').t`* Customizable features`}</p>
            <p className="text-center">
                <InlineLinkButton>
                    <span className="mr0-5">{c('Action').t`Compare all features`}</span>
                    <Icon name="arrow-down" />
                </InlineLinkButton>
            </p>
        </>
    );
};

export default PlanSelection;
