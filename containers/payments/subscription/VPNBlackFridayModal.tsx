import React from 'react';
import { toMap } from 'proton-shared/lib/helpers/object';
import { CYCLE, BLACK_FRIDAY } from 'proton-shared/lib/constants';
import { Currency, Cycle, Plan, PlanIDs, Subscription } from 'proton-shared/lib/interfaces';
import { isProductPayer } from 'proton-shared/lib/helpers/blackfriday';

import BlackFridayModal from './BlackFridayModal';

interface SelectParams {
    planIDs: PlanIDs;
    cycle: Cycle;
    currency: Currency;
    couponCode?: string | null;
}

interface Props {
    plans: Plan[];
    subscription: Subscription;
    onSelect: (params: SelectParams) => void;
}

const VPNBlackFridayModal = ({ plans = [], subscription, ...rest }: Props) => {
    const plansMap = toMap(plans, 'Name');
    const bundles = isProductPayer(subscription)
        ? [
              {
                  name: 'Plus Bundle',
                  cycle: CYCLE.TWO_YEARS,
                  planIDs: [plansMap.plus.ID, plansMap.vpnplus.ID],
              },
          ]
        : [
              {
                  name: 'Plus Plan',
                  cycle: CYCLE.YEARLY,
                  planIDs: [plansMap.vpnplus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE,
              },
              {
                  name: 'Plus Bundle',
                  cycle: CYCLE.TWO_YEARS,
                  planIDs: [plansMap.plus.ID, plansMap.vpnplus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE,
                  popular: true,
              },
              {
                  name: 'Plus Bundle',
                  cycle: CYCLE.YEARLY,
                  planIDs: [plansMap.plus.ID, plansMap.vpnplus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE,
              },
          ];

    return <BlackFridayModal bundles={bundles} {...rest} />;
};

export default VPNBlackFridayModal;
