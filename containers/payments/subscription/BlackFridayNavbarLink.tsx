import React, { useEffect, useState } from 'react';
import { APPS } from 'proton-shared/lib/constants';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';
import { PlanIDs, Cycle, Currency } from 'proton-shared/lib/interfaces';

import { useUser, useApi, useLoading, useBlackFriday, usePlans, useModals, useConfig } from '../../../hooks';
import { TopNavbarLink } from '../../../components';
import { checkLastCancelledSubscription } from './helpers';
import NewSubscriptionModal from './NewSubscriptionModal';
import VPNBlackFridayModal from './VPNBlackFridayModal';
import MailBlackFridayModal from './MailBlackFridayModal';

const BlackFridayNavbarLink = ({ ...rest }) => {
    const { APP_NAME } = useConfig();
    const [plans, loadingPlans] = usePlans();
    const { createModal } = useModals();
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [user] = useUser();
    const isBlackFriday = useBlackFriday();
    const [isEligible, setEligibility] = useState(false);
    const icon = 'blackfriday';
    const text = 'Black Friday';

    const onSelect = ({
        planIDs,
        cycle,
        currency,
        couponCode,
    }: {
        planIDs: PlanIDs;
        cycle: Cycle;
        currency: Currency;
        couponCode?: string | null;
    }) => {
        createModal(<NewSubscriptionModal planIDs={planIDs} cycle={cycle} currency={currency} coupon={couponCode} />);
    };

    useEffect(() => {
        if (user.isFree && isBlackFriday) {
            withLoading(checkLastCancelledSubscription(api).then(setEligibility));
        }
    }, [isBlackFriday, user.isFree]);

    if (!isBlackFriday || !isEligible || user.isPaid || loading || loadingPlans) {
        return null;
    }

    if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
        return (
            <TopNavbarLink
                to="/dashboard"
                toApp={APPS.PROTONVPN_SETTINGS}
                icon={icon}
                text={text}
                onClick={() => {
                    createModal(<VPNBlackFridayModal plans={plans} onSelect={onSelect} />);
                }}
                {...rest}
            />
        );
    }

    return (
        <TopNavbarLink
            to="/subscription"
            toApp={getAccountSettingsApp()}
            icon={icon}
            text={text}
            onClick={() => {
                createModal(<MailBlackFridayModal plans={plans} onSelect={onSelect} />);
            }}
            {...rest}
        />
    );
};

export default BlackFridayNavbarLink;
