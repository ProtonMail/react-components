import React from 'react';
import { usePlans } from 'react-components';
import { toMap } from 'proton-shared/lib/helpers/object';
import { CYCLE, BLACK_FRIDAY } from 'proton-shared/lib/constants';

import { BlackFridayModal } from './BlackFridayModal';

const MailBlackFridayModal = (props) => {
    const [plans = [], loadingPlans] = usePlans();
    const plansMap = toMap(plans, 'Name');
    const bundles = plans.length
        ? [
              {
                  name: 'ProtonMail Plus',
                  cycle: CYCLE.YEARLY,
                  pourcentage: 35,
                  planIDs: [plansMap.plus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE
              },
              {
                  name: 'ProtonMail Plus',
                  cycle: CYCLE.TWO_YEARS,
                  pourcentage: 40,
                  planIDs: [plansMap.plus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE,
                  popular: true
              },
              {
                  name: 'ProtonMail Plus & ProtonVPN Plus',
                  cycle: CYCLE.TWO_YEARS,
                  pourcentage: 50,
                  planIDs: [plansMap.plus.ID, plansMap.vpnplus.ID],
                  couponCode: BLACK_FRIDAY.COUPON_CODE
              }
          ]
        : [];

    return <BlackFridayModal loading={loadingPlans} bundles={bundles} {...props} />;
};

export default MailBlackFridayModal;
