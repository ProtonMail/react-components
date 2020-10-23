import React, { useState, useEffect } from 'react';
import { isProductPayer } from 'proton-shared/lib/helpers/blackfriday';
import { PlanIDs, Cycle, Currency } from 'proton-shared/lib/interfaces';
import { APPS, BLACK_FRIDAY } from 'proton-shared/lib/constants';
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
    useCookieState,
    useProductPayerPeriod,
    useBlackFridayPeriod,
} from '../../hooks';
import { MailBlackFridayModal, NewSubscriptionModal, VPNBlackFridayModal } from '../payments';
import { SUBSCRIPTION_STEPS } from '../payments/subscription/constants';

const useBlackFriday = () => {
    const api = useApi();
    const { APP_NAME } = useConfig();
    const [{ isFree, ID }] = useUser();
    const [plans = []] = usePlans();
    const [subscription] = useSubscription();
    const isBlackFridayPeriod = useBlackFridayPeriod();
    const isProductPayerPeriod = useProductPayerPeriod();
    const clearUserID = ID.replace(/=/g, ''); // '=' is causing issue when stored in cookie

    const [blackFridayModalState, setBlackFridayModalState] = useCookieState({
        cookieName: `${clearUserID}${BLACK_FRIDAY.COUPON_CODE}-black-friday-modal`,
        expirationDate: BLACK_FRIDAY.END.toUTCString(),
    });
    const [productPayerModalState, setProductPayerModalState] = useCookieState({
        cookieName: `${clearUserID}-product-payer-modal`,
        expirationDate: BLACK_FRIDAY.END.toUTCString(),
    });

    const [isEligible, setEligibility] = useState(false);
    const location = useLocation();
    const { createModal } = useModals();
    const [loading, withLoading] = useLoading();
    const openBlackFridayModal = location.search.includes('modal=bf2020');

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
        }
    }, [isBlackFridayPeriod, isFree]);

    useEffect(() => {
        if (
            plans.length &&
            isBlackFridayPeriod &&
            isEligible &&
            (blackFridayModalState !== '1' || openBlackFridayModal)
        ) {
            setBlackFridayModalState('1');
            if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
                createModal(<VPNBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            } else {
                createModal(<MailBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            }
        }
    }, [isBlackFridayPeriod, isEligible, plans]);

    useEffect(() => {
        if (plans.length && isProductPayerPeriod && isProductPayer(subscription) && productPayerModalState !== '1') {
            setProductPayerModalState('1');
            if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
                createModal(<VPNBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            } else {
                createModal(<MailBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
            }
        }
    }, [isProductPayerPeriod, subscription, plans]);

    return isBlackFridayPeriod && isEligible && !loading;
};

export default useBlackFriday;
