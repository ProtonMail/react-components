import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Badge } from 'react-components';
import { COUPON_CODES, BLACK_FRIDAY, CYCLE } from 'proton-shared/lib/constants';

import CycleDiscountBadge from './CycleDiscountBadge';

const { BUNDLE, PMTEAM } = COUPON_CODES;

const DiscountBadge = ({ code, cycle }) => {
    if (code === BUNDLE) {
        if (cycle === CYCLE.YEARLY) {
            return (
                <Badge
                    type="success"
                    tooltip={c('Discount with coupon code').t`36% discount applied to your subscription`}
                >
                    -36%
                </Badge>
            );
        }

        if (cycle === CYCLE.TWO_YEARS) {
            return (
                <Badge
                    type="success"
                    tooltip={c('Discount with coupon code').t`46% discount applied to your subscription`}
                >
                    -46%
                </Badge>
            );
        }

        return (
            <Badge type="success" tooltip={c('Discount with coupon code').t`20% discount applied to your subscription`}>
                -20%
            </Badge>
        );
    }

    if (code === BLACK_FRIDAY.COUPON_CODE) {
        return (
            <Badge
                type="success"
                tooltip={c('Discount with coupon code').t`Black Friday 2019 newcomer discount has been applied`}
            >
                Black Friday
            </Badge>
        );
    }

    if (code === PMTEAM) {
        return <Badge type="success">-100%</Badge>;
    }

    return <CycleDiscountBadge cycle={cycle} />;
};

DiscountBadge.propTypes = {
    code: PropTypes.string,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.YEARLY, CYCLE.TWO_YEARS])
};

export default DiscountBadge;
