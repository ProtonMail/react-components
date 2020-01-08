import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, generateUID } from 'react-components';
import { range } from 'proton-shared/lib/helpers/array';
import { identity } from 'proton-shared/lib/helpers/function';
import { c } from 'ttag';

const SubscriptionAddonRow = ({
    label,
    price,
    format = identity,
    start = 0,
    min = 0,
    max = 999,
    quantity = 0,
    onChange,
    step = 1,
    loading = false
}) => {
    const [idRef] = useState(() => generateUID('subscription-addon-row'));
    const options = range(min, max).map((quantity) => ({
        text: format(start + quantity * step),
        value: quantity
    }));

    return (
        <div className="flex flex-nowrap flex-spacebetween flex-items-center mb1">
            <label htmlFor={idRef.current} className="w30">
                {label}
            </label>
            <div className="flex flex-nowrap w50">
                <div className="w25">
                    <Button
                        className="flex-item-noshrink w100"
                        onClick={() => onChange(quantity - 1)}
                        disabled={loading || quantity === min}
                        icon="minus"
                    />
                </div>
                <div className="w50 pl0-5 pr0-5">
                    <Select
                        disabled={loading}
                        className="w100"
                        id={idRef.current}
                        options={options}
                        onChange={({ target }) => onChange(+target.value)}
                        value={quantity}
                    />
                </div>
                <div className="w25">
                    <Button
                        className="flex-item-noshrink w100"
                        onClick={() => onChange(quantity + 1)}
                        disabled={loading || quantity === max}
                        icon="plus"
                    />
                </div>
            </div>
            <div className="w30 big mb0 mt0 alignright">{quantity ? price : c('Info').t`Included`}</div>
        </div>
    );
};

SubscriptionAddonRow.propTypes = {
    loading: PropTypes.bool,
    label: PropTypes.node.isRequired,
    price: PropTypes.node.isRequired,
    start: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    quantity: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    format: PropTypes.func
};

export default SubscriptionAddonRow;
