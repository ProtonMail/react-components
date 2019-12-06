import React from 'react';
import { SubscriptionTable } from 'react-components';
import PropTypes from 'prop-types';
import { PLAN_NAMES, PLANS, CYCLE } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';
import freePlanSvg from 'design-system/assets/img/pv-images/plans/free-plan.svg';
import plusPlanSvg from 'design-system/assets/img/pv-images/plans/vpnbasic-plan.svg';
import professionalPlanSvg from 'design-system/assets/img/pv-images/plans/vpnplus-plan.svg';
import visionaryPlanSvg from 'design-system/assets/img/pv-images/plans/visionary-plan.svg';

import SubscriptionPrices from './SubscriptionPrices';

const INDEXES = {
    [PLANS.VPNBASIC]: 1,
    [PLANS.VPNPLUS]: 2,
    [PLANS.VISIONARY]: 3
};

const FREE_PLAN = {
    Pricing: {
        [CYCLE.MONTHLY]: 0,
        [CYCLE.YEARLY]: 0,
        [CYCLE.TWO_YEARS]: 0
    }
};

const VpnSubscriptionTable = ({ planNameSelected, plans: apiPlans = [], cycle, currency, onSelect, currentPlan }) => {
    const plansMap = toMap(apiPlans, 'Name');
    const vpnBasicPlan = plansMap[PLANS.VPNBASIC];
    const vpnPlusPlan = plansMap[PLANS.PROFESSIONAL];
    const visionaryPlan = plansMap[PLANS.VISIONARY];
    const plans = [
        {
            planName: 'Free',
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={FREE_PLAN} />,
            imageSrc: freePlanSvg,
            description: c('Description').t`Privacy and security for everyone`,
            features: [
                c('Feature').t`1 VPN connection`,
                c('Feature').t`Servers in 3 countries`,
                c('Feature').t`Medium speed`,
                c('Feature').t`No logs/No ads`,
                <del key="filesharing">{c('Feature').t`Filesharing/bitorrent support`}</del>,
                <del key="secure">{c('Feature').t`Secure Core and Tor VPN`}</del>,
                <del key="advanced">{c('Feature').t`Advanced privacy features`}</del>,
                <del key="access">{c('Feature').t`Access blocked content`}</del>
            ]
        },
        vpnBasicPlan && {
            planID: vpnBasicPlan.ID,
            planName: PLAN_NAMES[PLANS.VPNBASIC],
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={vpnBasicPlan} />,
            imageSrc: plusPlanSvg,
            description: c('Description').t`Basic privacy features`,
            features: [
                c('Feature').t`2 VPN connection`,
                c('Feature').t`Servers in XX countries`, // TODO
                c('Feature').t`High speed`,
                c('Feature').t`No logs/No ads`,
                <del key="filesharing">{c('Feature').t`Filesharing/bitorrent support`}</del>,
                <del key="secure">{c('Feature').t`Secure Core and Tor VPN`}</del>,
                <del key="advanced">{c('Feature').t`Advanced privacy features`}</del>,
                <del key="access">{c('Feature').t`Access blocked content`}</del>
            ]
        },
        vpnPlusPlan && {
            planID: vpnPlusPlan.ID,
            planName: PLAN_NAMES[PLANS.VPNPLUS],
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={vpnPlusPlan} />,
            imageSrc: professionalPlanSvg,
            description: c('Description').t`Advanced security features`,
            features: [
                c('Feature').t`5 VPN connection`,
                c('Feature').t`Servers in XX countries`, // TODO
                c('Feature').t`Highest speed (10 Gbps)`,
                c('Feature').t`No logs/No ads`,
                c('Feature').t`Filesharing/bitorrent support`,
                c('Feature').t`Secure Core and Tor VPN`,
                c('Feature').t`Advanced privacy features`,
                c('Feature').t`Access blocked content`
            ]
        },
        visionaryPlan && {
            planID: visionaryPlan.ID,
            planName: PLAN_NAMES[PLANS.VISIONARY],
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={visionaryPlan} />,
            imageSrc: visionaryPlanSvg,
            description: c('Description').t`The complete privacy suite`,
            features: [
                c('Feature').t`All Plus plan features`,
                c('Feature').t`10 simultaneous VPN connections`,
                c('Feature').t`ProtonMail Visionary account`
            ]
        }
    ];

    return (
        <div className="vpnSubscriptionTable-container">
            <SubscriptionTable
                currentPlanIndex={INDEXES[planNameSelected] || 0}
                mostPopularIndex={2}
                plans={plans}
                onSelect={(index) => onSelect(plans[index].planID)}
                currentPlan={currentPlan}
            />
        </div>
    );
};

VpnSubscriptionTable.propTypes = {
    currentPlan: PropTypes.string,
    planNameSelected: PropTypes.string,
    plans: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]).isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']).isRequired
};

export default VpnSubscriptionTable;
