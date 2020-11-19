import React, { useState, useEffect } from 'react';
import { isProductPayer } from 'proton-shared/lib/helpers/blackfriday';
import { PlanIDs, Cycle, Currency } from 'proton-shared/lib/interfaces';
import { APPS } from 'proton-shared/lib/constants';
import { useLocation } from 'react-router';

import { checkLastCancelledSubscription } from '../payments/subscription/helpers';
import {
    useLoading,
    useModals,
    useUser,
    useSubscription,
    usePlans,
    useApi,
    useConfig,
    useProductPayerPeriod,
    useBlackFridayPeriod,
} from '../../hooks';
import { MailBlackFridayModal, NewSubscriptionModal, VPNBlackFridayModal } from '../payments';
import { SUBSCRIPTION_STEPS } from '../payments/subscription/constants';
import usePromoModalState from './usePromoModalState';

const useBlackFriday = () => {
    const api = useApi();
    const { APP_NAME } = useConfig();
    const [{ isFree, isDelinquent }] = useUser();
    const [plans = []] = usePlans();
    const [subscription] = useSubscription();
    const isBlackFridayPeriod = useBlackFridayPeriod();
    const isProductPayerPeriod = useProductPayerPeriod();
    const [modalState, loadingModalState, setModalState] = usePromoModalState();
    const [isEligible, setEligibility] = useState(false);
    const location = useLocation();
    const { createModal } = useModals();
    const [loading, withLoading] = useLoading();
    const openBlackFridayModal = location.search.includes('modal=bf2020');
    const noBFCoupon = location.search.includes('coupon=bf2020');

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
        createModal(
            <NewSubscriptionModal
                planIDs={planIDs}
                cycle={cycle}
                currency={currency}
                coupon={couponCode}
                step={SUBSCRIPTION_STEPS.PAYMENT}
            />
        );
    };

    useEffect(() => {
        if (isFree && isBlackFridayPeriod) {
            withLoading(checkLastCancelledSubscription(api).then(setEligibility));
        } else {
            setEligibility(false);
        }
    }, [isBlackFridayPeriod, isFree]);

    useEffect(() => {
        if (isDelinquent || loadingModalState) {
            return;
        }
        if (
            plans.length &&
            isBlackFridayPeriod &&
            isEligible &&
            ((!modalState && !noBFCoupon) || openBlackFridayModal)
        ) {
            setModalState(true);
            if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
                createModal(<VPNBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            } else {
                createModal(<MailBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            }
        }
    }, [loadingModalState, isBlackFridayPeriod, isEligible, plans]);

    useEffect(() => {
        if (isDelinquent || loadingModalState) {
            return;
        }
        if (plans.length && isProductPayerPeriod && isProductPayer(subscription) && !modalState) {
            setModalState(true);
            if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
                createModal(<VPNBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            } else {
                createModal(<MailBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            }
        }
    }, [loadingModalState, isProductPayerPeriod, subscription, plans]);

    return (
        !loading &&
        plans.length &&
        !isDelinquent &&
        ((isBlackFridayPeriod && isEligible) || (isProductPayerPeriod && isProductPayer(subscription)))
    );
};

export default useBlackFriday;
