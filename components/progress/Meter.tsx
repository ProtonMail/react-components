import React from 'react';

import { classnames } from '../../helpers';

interface Props {
    /**
     * minimum possible value of a data
     */
    min?: number;
    /**
     * maximum possible value of a data
     */
    max?: number;
    /**
     * when the value of the data can be understood as low
     */
    low?: number;
    /**
     * when the value of the data can be understood as high
     */
    high?: number;
    /**
     * the optimum value of the data. Will influence the color of low and high values.
     */
    optimum?: number;
    /**
     * current value of a data
     */
    value?: number;
    /**
     * an id to a description of the data
     */
    id?: string;
    /**
     * className applied to the root 'meter' html element
     */
    className?: string;
}

const Meter = ({ min = 0, low = 50, high = 80, max = 100, optimum = 0, value = 50, id, className }: Props) => {
    return (
        <meter
            min={min}
            low={low}
            high={high}
            max={max}
            optimum={optimum}
            value={value}
            aria-describedby={id}
            className={classnames(['meterbar', className])}
        />
    );
};

export default Meter;
