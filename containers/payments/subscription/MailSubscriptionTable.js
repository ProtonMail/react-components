import React from 'react';
import PropTypes from 'prop-types';
import { PLAN_NAMES, PLANS, CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';

import { Button } from '../../../components';
import { useModals } from '../../../hooks';

import SubscriptionTable from './SubscriptionTable';
import SubscriptionPrices from './SubscriptionPrices';
import SubscriptionFeaturesModal from './SubscriptionFeaturesModal';

const MailSubscriptionTable = ({
    planNameSelected,
    plans: apiPlans = [],
    cycle,
    currency,
    onSelect,
    currentPlan,
    ...rest
}) => {
    const { createModal } = useModals();
    const plansMap = toMap(apiPlans, 'Name');
    const plusPlan = plansMap[PLANS.PLUS];
    const professionalPlan = plansMap[PLANS.PROFESSIONAL];
    const visionaryPlan = plansMap[PLANS.VISIONARY];

    const plans = [
        plusPlan && {
            name: plusPlan.Name,
            planID: plusPlan.ID,
            title: PLAN_NAMES[PLANS.PLUS],
            canCustomize: true,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={plusPlan} />,
            description: c('Description').t`Full-featured mailbox with advanced protection.`,
            features: [
                { content: c('Feature').t`1 user` },
                { content: c('Feature').t`5 GB storage *` },
                { content: c('Feature').t`5 addresses` },
                { content: c('Feature').t`200 folders / labels` },
                { content: c('Feature').t`Custom email addresses`, info: c('Info').t`Custom email addresses` },
            ],
        },

        professionalPlan && {
            name: professionalPlan.Name,
            planID: professionalPlan.ID,
            title: PLAN_NAMES[PLANS.PROFESSIONAL],
            canCustomize: true,
            price: (
                <SubscriptionPrices
                    cycle={cycle}
                    currency={currency}
                    plan={professionalPlan}
                    suffix={c('Suffix').t`/month/user`}
                />
            ),
            description: c('Description').t`ProtonMail for professionals and businesses.`,
            features: [
                { content: c('Feature').t`1 - 5000 user *` },
                { content: c('Feature').t`5 GB storage / user *` },
                { content: c('Feature').t`5 addresses / user *` },
                { content: c('Feature').t`Unlimited folders / labels` },
                { content: c('Feature').t`Custom email addresses`, info: c('Info').t`Custom email addresses` },
            ],
        },

        visionaryPlan && {
            name: visionaryPlan.Name,
            planID: visionaryPlan.ID,
            title: PLAN_NAMES[PLANS.VISIONARY],
            canCustomize: false,
            price: <SubscriptionPrices cycle={cycle} currency={currency} plan={visionaryPlan} />,
            description: c('Description').t`ProtonMail for families and small businesses.`,
            features: [
                { content: c('Feature').t`6 users` },
                { content: c('Feature').t`20 GB storage` },
                { content: c('Feature').t`50 addresses` },
                { content: c('Feature').t`Unlimited folders / labels` },
                { content: c('Feature').t`Custom email addresses`, info: c('Info').t`Custom email addresses` },
            ],
        },
    ];

    return (
        <div className="mailSubscriptionTable-container">
            <SubscriptionTable
                currentPlan={currentPlan}
                mostPopularIndex={1}
                plans={plans}
                onSelect={(index, expanded) => {
                    onSelect(plans[index].planID, expanded);
                }}
                {...rest}
            />
            <p className="text-sm mt1 mb0">* {c('Info concerning plan features').t`Customizable features`}</p>
            <div className="text-center pb1 on-mobile-pb2 subscriptionTable-show-features-container">
                <Button
                    shape="ghost"
                    size="small"
                    color="norm"
                    onClick={() => createModal(<SubscriptionFeaturesModal currency={currency} cycle={cycle} />)}
                >
                    {c('Action').t`Compare plans`}
                </Button>
            </div>
        </div>
    );
};

MailSubscriptionTable.propTypes = {
    currentPlan: PropTypes.string,
    planNameSelected: PropTypes.string,
    plans: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
};

export default MailSubscriptionTable;
