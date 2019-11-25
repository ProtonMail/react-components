import React from 'react';
import { SubscriptionTable } from 'react-components';
import PropTypes from 'prop-types';
import { PLAN_NAMES, PLANS, CYCLE } from 'proton-shared/lib/constants';
import { getPlan } from 'proton-shared/lib/subscription';
import { c } from 'ttag';
import freePlanSvg from 'design-system/assets/img/pm-images/free-plan.svg';
import plusPlanSvg from 'design-system/assets/img/pm-images/plus-plan.svg';
import professionalPlanSvg from 'design-system/assets/img/pm-images/professional-plan.svg';
import visionaryPlanSvg from 'design-system/assets/img/pm-images/visionary-plan.svg';

import SubscriptionPrices from './SubscriptionPrices';

const INDEXES = {
    [PLANS.PLUS]: 1,
    [PLANS.PROFESSIONAL]: 2,
    [PLANS.VISIONARY]: 3
};

const FREE_PLAN = {
    Pricing: {
        [CYCLE.MONTHLY]: 0,
        [CYCLE.YEARLY]: 0,
        [CYCLE.TWO_YEARS]: 0
    }
};

const MailSubscriptionTable = ({ subscription = {}, plans: apiPlans = [], cycle, currency, onSelect }) => {
    const plusPlan = apiPlans.find(({ Name }) => Name === PLANS.PLUS);
    const professionalPlan = apiPlans.find(({ Name }) => Name === PLANS.PROFESSIONAL);
    const visionaryPlan = apiPlans.find(({ Name }) => Name === PLANS.VISIONARY);
    const plans = [
        {
            planName: 'Free',
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={FREE_PLAN} />,
            imageSrc: freePlanSvg,
            description: c('Description').t`The basics for private and secure communications`,
            features: []
        },
        plusPlan && {
            planName: PLAN_NAMES.PLUS,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={plusPlan} />,
            imageSrc: plusPlanSvg,
            description: c('Description').t`Full-featured mailbox with advanced protection`,
            features: []
        },
        professionalPlan && {
            planName: PLAN_NAMES.PROFESSIONAL,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={professionalPlan} />,
            imageSrc: professionalPlanSvg,
            description: c('Description').t`ProtonMail for professionals and businesses`,
            features: []
        },
        visionaryPlan && {
            planName: PLAN_NAMES.VISIONARY,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={visionaryPlan} />,
            imageSrc: visionaryPlanSvg,
            description: c('Description').t`ProtonMail for families and small businesses`,
            features: []
        }
    ];
    const { Name } = getPlan(subscription);

    return (
        <SubscriptionTable
            currentPlanIndex={INDEXES[Name] || 0}
            mostPopularIndex={1}
            plans={plans}
            onSelect={onSelect}
        />
    );
};

MailSubscriptionTable.propTypes = {
    subscription: PropTypes.object,
    plans: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]).isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']).isRequired
};

export default MailSubscriptionTable;
