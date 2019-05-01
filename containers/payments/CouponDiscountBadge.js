import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Badge } from 'react-components';
import { COUPON_CODES } from 'proton-shared/lib/constants';

const CouponDiscountBadge = ({ code }) => {
    if (code === COUPON_CODES.BUNDLE) {
        return (
            <Badge type="success" tooltip={c('Discount with coupon code').t`20% discount applied to your subscription`}>
                -20%
            </Badge>
        );
    }

    return null;
};

CouponDiscountBadge.propTypes = {
    code: PropTypes.string
};

export default CouponDiscountBadge;
