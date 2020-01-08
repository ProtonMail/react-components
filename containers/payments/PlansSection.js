import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    CurrencySelector,
    CycleSelector,
    DowngradeModal,
    LossLoyaltyModal,
    MozillaInfoPanel,
    useSubscription,
    useOrganization,
    Loader,
    usePlans,
    useApi,
    useUser,
    useModals,
    useEventManager,
    useNotifications,
    useConfig
} from 'react-components';

import { checkSubscription, deleteSubscription } from 'proton-shared/lib/api/payments';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, CLIENT_TYPES } from 'proton-shared/lib/constants';
import { getPlans, isBundleEligible, getPlan } from 'proton-shared/lib/helpers/subscription';
import { isLoyal } from 'proton-shared/lib/helpers/organization';

import NewSubscriptionModal from './subscription/NewSubscriptionModal';
import MailSubscriptionTable from './subscription/MailSubscriptionTable';
import VpnSubscriptionTable from './subscription/VpnSubscriptionTable';

const PlansSection = () => {
    const { call } = useEventManager();
    const { CLIENT_TYPE } = useConfig();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [user] = useUser();
    const [subscription = {}, loadingSubscription] = useSubscription();
    const [organization = {}, loadingOrganization] = useOrganization();
    const [plans = [], loadingPlans] = usePlans();
    const api = useApi();
    const { Name } = getPlan(subscription) || {};

    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [cycle, setCycle] = useState(DEFAULT_CYCLE);
    const bundleEligible = isBundleEligible(subscription);
    const { CouponCode, Plans = [] } = subscription;
    const names = getPlans(subscription)
        .map(({ Title }) => Title)
        .join(c('Separator, spacing is important').t` and `);

    const handleUnsubscribe = async () => {
        await api(deleteSubscription());
        await call();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleOpenModal = async () => {
        if (user.isFree) {
            return createNotification({ type: 'error', text: c('Info').t`You already have a free account` });
        }
        await new Promise((resolve, reject) => {
            createModal(<DowngradeModal onConfirm={resolve} onClose={reject} />);
        });
        if (isLoyal(organization)) {
            await new Promise((resolve, reject) => {
                createModal(<LossLoyaltyModal user={user} onConfirm={resolve} onClose={reject} />);
            });
        }
        return handleUnsubscribe();
    };

    const handleModal = async (planID = '', expanded = false) => {
        if (!planID) {
            handleOpenModal();
            return;
        }

        const couponCode = CouponCode ? CouponCode : undefined; // From current subscription; CouponCode can be null
        const { Coupon } = await api(
            checkSubscription({
                PlanIDs: [planID],
                Currency: currency,
                Cycle: cycle,
                CouponCode: couponCode
            })
        );

        const coupon = Coupon ? Coupon.Code : undefined; // Coupon can equals null

        createModal(
            <NewSubscriptionModal
                expanded={expanded}
                planIDs={{ [planID]: 1 }}
                coupon={coupon}
                currency={currency}
                cycle={cycle}
            />
        );
    };

    useEffect(() => {
        if (loadingPlans || loadingSubscription) {
            return;
        }
        const [{ Currency, Cycle } = {}] = plans;
        setCurrency(subscription.Currency || Currency);
        setCycle(subscription.Cycle || Cycle);
    }, [loadingSubscription, loadingPlans]);

    if (subscription.isManagedByMozilla) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <MozillaInfoPanel />
            </>
        );
    }

    if (loadingSubscription || loadingPlans || loadingOrganization) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <Loader />
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Plans`}</SubTitle>
            <div className="flex flex-spacebetween onmobile-flex-column">
                <Alert learnMore="https://protonmail.com/support/knowledge-base/paid-plans/">
                    {bundleEligible ? (
                        <div>{c('Info')
                            .t`Get 20% bundle discount when you purchase ProtonMail and ProtonVPN together.`}</div>
                    ) : null}
                    {Plans.length ? <div>{c('Info').t`You are currently subscribed to ${names}.`}</div> : null}
                </Alert>
                <div className="flex flex-nowrap">
                    <CycleSelector cycle={cycle} onSelect={setCycle} className="mr1" />
                    <CurrencySelector currency={currency} onSelect={setCurrency} />
                </div>
            </div>
            {CLIENT_TYPE === CLIENT_TYPES.MAIL ? (
                <MailSubscriptionTable
                    plans={plans}
                    planNameSelected={Name}
                    cycle={cycle}
                    currency={currency}
                    onSelect={handleModal}
                />
            ) : (
                <VpnSubscriptionTable
                    plans={plans}
                    planNameSelected={Name}
                    cycle={cycle}
                    currency={currency}
                    onSelect={handleModal}
                />
            )}
        </>
    );
};

export default PlansSection;
