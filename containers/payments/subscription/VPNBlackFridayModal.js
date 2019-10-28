import React from 'react';
import PropTypes from 'prop-types';
import { toMap } from 'proton-shared/lib/helpers/object';
import { CYCLE, BLACK_FRIDAY } from 'proton-shared/lib/constants';

import BlackFridayModal from './BlackFridayModal';

const VPNBlackFridayModal = ({ plans = [], ...rest }) => {
    const plansMap = toMap(plans, 'Name');
    const bundles = [
        {
            name: 'ProtonVPN Plus',
            cycle: CYCLE.YEARLY,
            pourcentage: 35,
            planIDs: [plansMap.vpnplus.ID],
            couponCode: BLACK_FRIDAY.COUPON_CODE
        },
        {
            name: 'ProtonVPN Plus',
            cycle: CYCLE.TWO_YEARS,
            pourcentage: 40,
            planIDs: [plansMap.vpnplus.ID],
            couponCode: BLACK_FRIDAY.COUPON_CODE,
            popular: true
        },
        {
            name: 'VPN Plus & Mail Plus',
            cycle: CYCLE.TWO_YEARS,
            pourcentage: 50,
            planIDs: [plansMap.plus.ID, plansMap.vpnplus.ID],
            couponCode: BLACK_FRIDAY.COUPON_CODE
        }
    ];

    return <BlackFridayModal bundles={bundles} {...rest} />;
};

VPNBlackFridayModal.propTypes = {
    plans: PropTypes.array.isRequired
};

export default VPNBlackFridayModal;
