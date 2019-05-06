import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Price } from 'react-components';

import CyclePromotion from './CyclePromotion';
import { getTotal } from './helpers';

const OrderSummary = ({ plans, model, onChange }) => {
    const total = getTotal({ ...model, plans });
    return (
        <>
            <CyclePromotion model={model} onChange={onChange} />
            <h4>{c('Title').t`Subscription details`}</h4>
            <div className="flex flex-spacebetween mb1">
                <div className="bold">{c('Label').t`Total`}</div>
                <div>
                    <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                        {total / model.cycle}
                    </Price>
                </div>
            </div>
        </>
    );
};

OrderSummary.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default OrderSummary;
