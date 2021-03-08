import React from 'react';
import { hasVpnBasic, getPlanIDs } from 'proton-shared/lib/helpers/subscription';
import { switchPlan } from 'proton-shared/lib/helpers/planIDs';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, PLAN_SERVICES, PLANS } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';
import { Loader, Icon, Button } from '../../../components';
import { useUser, useSubscription, useModals, usePlans, useOrganization } from '../../../hooks';

import NewSubscriptionModal from './NewSubscriptionModal';

const UpsellVPNSubscription = () => {
    const [{ hasPaidVpn }, loadingUser] = useUser();
    const [subscription, loadingSubscription] = useSubscription();
    const [organization, loadingOrganization] = useOrganization();
    const [plans = [], loadingPlans] = usePlans();
    const { Currency = DEFAULT_CURRENCY, Cycle = DEFAULT_CYCLE } = subscription || {};
    const isFreeVpn = !hasPaidVpn;
    const { createModal } = useModals();
    const plansMap = toMap(plans, 'Name');
    const planIDs = getPlanIDs(subscription);

    const handleUpgradeClick = () => {
        createModal(
            <NewSubscriptionModal
                currency={Currency}
                cycle={Cycle}
                planIDs={switchPlan({
                    planIDs,
                    plans,
                    planID: plansMap[PLANS.VPNPLUS].ID,
                    service: PLAN_SERVICES.MAIL,
                    organization,
                })}
            />
        );
    };

    if (loadingUser || loadingSubscription || loadingPlans || loadingOrganization) {
        return <Loader />;
    }

    if (!isFreeVpn && !hasVpnBasic(subscription)) {
        return null;
    }

    return (
        <div className="bg-global-highlight p1 mt1-5">
            <div className="flex flex-align-items-center">
                <Icon name="speed-fast" className="mr0-5 color-pm-blue" />{' '}
                {c('VPN upsell feature').t`Higher speed servers (up to 10Gbps)`}
            </div>
            <div className="flex flex-align-items-center">
                <Icon name="tour" className="mr0-5 color-pm-blue" />{' '}
                {c('VPN upsell feature').t`Access geo-blocked content (Netflix, Youtube, etc.)`}
            </div>
            <div className="flex flex-align-items-center">
                <Icon name="protonvpn" className="mr0-5 color-pm-blue" />{' '}
                {c('VPN upsell feature').t`Unlock advanced VPN features`}
            </div>
            <Button color="norm" className="mt1" onClick={handleUpgradeClick}>
                {c('Action').t`Upgrade to Plus`}
            </Button>
        </div>
    );
};

export default UpsellVPNSubscription;
