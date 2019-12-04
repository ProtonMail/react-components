import React from 'react';
import { SubscriptionTable } from 'react-components';
import PropTypes from 'prop-types';
import { PLAN_NAMES, PLANS, CYCLE } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
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

const MailSubscriptionTable = ({ planNameSelected, plans: apiPlans = [], cycle, currency, onSelect }) => {
    const plansMap = toMap(apiPlans, 'Name');
    const plusPlan = plansMap[PLANS.PLUS];
    const professionalPlan = plansMap[PLANS.PROFESSIONAL];
    const visionaryPlan = plansMap[PLANS.VISIONARY];
    const plans = [
        {
            planName: 'Free',
            canCustomize: true,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={FREE_PLAN} />,
            imageSrc: freePlanSvg,
            description: c('Description').t`Basic private and secure comminications`,
            features: [
                c('Feature').t`1 user`,
                c('Feature').t`500 MB storage`,
                c('Feature').t`1 address`,
                c('Feature').t`No domain support`,
                c('Feature').t`150 messages/day`,
                c('Feature').t`ProtonVPN (optional)`
            ],
            allFeatures: [
                c('Feature').t`1 user`,
                c('Feature').t`500 MB storage`,
                c('Feature').t`1 address`,
                c('Feature').t`No domain support`,
                c('Feature').t`150 messages per day`,
                c('Feature').t`3 folders/labels`,
                <del key="encrypted">{c('Feature').t`Encrypted contacts`}</del>,
                <del key="address">{c('Feature').t`Address verification`}</del>,
                <del key="filters">{c('Feature').t`Filters`}</del>,
                <del key="imap">{c('Feature').t`IMAP/SMTP support`}</del>,
                <del key="auto">{c('Feature').t`Auto-responder`}</del>,
                <del key="me">{c('Feature').t`@pm.me short email`}</del>,
                <del key="catch">{c('Feature').t`Catch-all email`}</del>,
                <del key="multi">{c('Feature').t`Multi-user support`}</del>,
                c('Feature').t`Limited support`
            ]
        },
        plusPlan && {
            planID: plusPlan.ID,
            planName: PLAN_NAMES[PLANS.PLUS],
            canCustomize: true,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={plusPlan} />,
            imageSrc: plusPlanSvg,
            description: c('Description').t`Full-featured individual mailbox`,
            features: [
                c('Feature').t`1 user`,
                c('Feature').t`5 GB storage *`,
                c('Feature').t`5 addresses *`,
                c('Feature').t`Supports 1 domain *`,
                c('Feature').t`Folder, labels, filters, auto-reply, IMAP/SMTP and more`,
                c('Feature').t`ProtonVPN (optional)`
            ],
            allFeatures: [
                c('Feature').t`1 user`,
                c('Feature').t`5 GB storage *`,
                c('Feature').t`5 addresses *`,
                c('Feature').t`1 custom domain *`,
                c('Feature').t`Unlimited messages **`,
                c('Feature').t`Unlimited folders/labels`,
                c('Feature').t`Encrypted contacts`,
                c('Feature').t`Address verification`,
                c('Feature').t`Filters`,
                c('Feature').t`IMAP/SMTP support`,
                c('Feature').t`Auto-responder`,
                c('Feature').t`@pm.me short email`,
                <del key="catch">{c('Feature').t`Catch-all email`}</del>,
                <del key="multi">{c('Feature').t`Multi-user support`}</del>,
                c('Feature').t`Normal support`
            ]
        },
        professionalPlan && {
            planID: professionalPlan.ID,
            planName: PLAN_NAMES[PLANS.PROFESSIONAL],
            canCustomize: true,
            price: (
                <SubscriptionPrices
                    cycle={cycle}
                    currency={currency}
                    plan={professionalPlan}
                    suffix={c('Suffix').t`/month/user`}
                />
            ),
            imageSrc: professionalPlanSvg,
            description: c('Description').t`For large organizations and businesses`,
            features: [
                c('Feature').t`1 - 5000 user *`,
                c('Feature').t`5 GB storage per user *`,
                c('Feature').t`5 addresses per user *`,
                c('Feature').t`Supports 2 domains *`,
                c('Feature').t`Catch-all email, multi-user management`,
                c('Feature').t`Priority support`
            ],
            allFeatures: [
                c('Feature').t`1-5000 user`,
                c('Feature').t`5 GB per user *`,
                c('Feature').t`5 addresses per user *`,
                c('Feature').t`2 custom domains *`,
                c('Feature').t`Unlimited messages **`,
                c('Feature').t`Unlimited folders/labels`,
                c('Feature').t`Encrypted contacts`,
                c('Feature').t`Address verification`,
                c('Feature').t`Filters`,
                c('Feature').t`IMAP/SMTP support`,
                c('Feature').t`Auto-responder`,
                c('Feature').t`@pm.me short email`,
                c('Feature').t`Catch-all email`,
                c('Feature').t`Multi-user support`,
                c('Feature').t`Priority support`
            ]
        },
        visionaryPlan && {
            planID: visionaryPlan.ID,
            planName: PLAN_NAMES[PLANS.VISIONARY],
            canCustomize: false,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={visionaryPlan} />,
            imageSrc: visionaryPlanSvg,
            description: c('Description').t`For families and small businesses`,
            features: [
                c('Feature').t`6 users`,
                c('Feature').t`20 GB storage`,
                c('Feature').t`50 addresses`,
                c('Feature').t`Supports 10 domains`,
                c('Feature').t`Includes all features`,
                c('Feature').t`Includes ProtonVPN`
            ],
            allFeatures: [
                c('Feature').t`6 users`,
                c('Feature').t`20 GB storage`,
                c('Feature').t`50 addresses`,
                c('Feature').t`10 custom domains *`,
                c('Feature').t`Unlimited messages **`,
                c('Feature').t`Unlimited folders/labels`,
                c('Feature').t`Encrypted contacts`,
                c('Feature').t`Address verification`,
                c('Feature').t`Filters`,
                c('Feature').t`IMAP/SMTP support`,
                c('Feature').t`Auto-responder`,
                c('Feature').t`@pm.me short email`,
                c('Feature').t`Catch-all email`,
                c('Feature').t`Multi-user support`,
                c('Feature').t`Priority support`
            ]
        }
    ];

    return (
        <>
            <SubscriptionTable
                currentPlanIndex={INDEXES[planNameSelected] || 0}
                mostPopularIndex={1}
                plans={plans}
                onSelect={(index) => onSelect(plans[index].planID)}
            />
            <p className="small mt1 mb0">* {c('Info concerning plan features').t`Customizable features`}</p>
            <p className="small mt0 mb0">
                **{' '}
                {c('Info concerning plan features')
                    .t`ProtonMail cannot be used for mass emailing or spamming. Legitimate emails are unlimited.`}
            </p>
        </>
    );
};

MailSubscriptionTable.propTypes = {
    planNameSelected: PropTypes.string,
    plans: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]).isRequired,
    currency: PropTypes.oneOf(['EUR', 'CHF', 'USD']).isRequired
};

export default MailSubscriptionTable;
