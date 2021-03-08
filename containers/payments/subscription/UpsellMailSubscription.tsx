import React from 'react';
import { hasMailPlus, getPlanIDs } from 'proton-shared/lib/helpers/subscription';
import { switchPlan } from 'proton-shared/lib/helpers/planIDs';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, PLAN_SERVICES, PLANS } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';
import { Loader, Icon, Button } from '../../../components';
import { useUser, useSubscription, useModals, usePlans, useAddresses, useOrganization } from '../../../hooks';

import NewSubscriptionModal from './NewSubscriptionModal';

const UpsellMailSubscription = () => {
    const [{ hasPaidMail }, loadingUser] = useUser();
    const [subscription, loadingSubscription] = useSubscription();
    const [organization, loadingOrganization] = useOrganization();
    const [plans = [], loadingPlans] = usePlans();
    const { Currency = DEFAULT_CURRENCY, Cycle = DEFAULT_CYCLE } = subscription || {};
    const isFreeMail = !hasPaidMail;
    const { createModal } = useModals();
    const [addresses, loadingAddresses] = useAddresses();
    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const plansMap = toMap(plans, 'Name');
    const planIDs = getPlanIDs(subscription);

    const handleUpgradeClick = (plan: PLANS) => () => {
        createModal(
            <NewSubscriptionModal
                currency={Currency}
                cycle={Cycle}
                planIDs={switchPlan({
                    planIDs,
                    plans,
                    planID: plansMap[plan].ID,
                    service: PLAN_SERVICES.MAIL,
                    organization,
                })}
            />
        );
    };

    if (loadingUser || loadingSubscription || loadingPlans || loadingAddresses || loadingOrganization) {
        return <Loader />;
    }

    return [
        isFreeMail && hasAddresses && (
            <div className="bg-global-highlight p1 mt1-5" key="0">
                <div className="flex flex-align-items-center">
                    <Icon name="organization-users" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Get Multi-user support`}
                </div>
                <div className="flex flex-align-items-center">
                    <Icon name="organization" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Host emails for your organization`}
                </div>
                <div className="flex flex-align-items-center">
                    <Icon name="keys" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Create separate logins for each user`}
                </div>
                <Button color="norm" className="mt1" onClick={handleUpgradeClick(PLANS.PLUS)}>
                    {c('Action').t`Upgrade to Plus`}
                </Button>
            </div>
        ),
        hasMailPlus(subscription) && hasAddresses && (
            <div className="bg-global-highlight p1 mt1-5" key="1">
                <div className="flex flex-align-items-center">
                    <Icon name="organization-users" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Get Multi-user support`}
                </div>
                <div className="flex flex-align-items-center">
                    <Icon name="organization" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Host emails for your organization`}
                </div>
                <div className="flex flex-align-items-center">
                    <Icon name="keys" className="mr0-5 color-pm-blue" />{' '}
                    {c('Mail upsell feature').t`Create separate logins for each user`}
                </div>
                <Button color="norm" className="mt1" onClick={handleUpgradeClick(PLANS.PROFESSIONAL)}>
                    {c('Action').t`Upgrade to Professional`}
                </Button>
            </div>
        ),
    ].filter(Boolean);
};

export default UpsellMailSubscription;
