import React from 'react';

import { classnames } from '../../helpers/component';

interface Props {
    value?: number;
    low?: number;
    min?: number;
    max?: number;
    id?: string;
    className?: string;
}

const Meter = ({ value = 50, low = 0, min = 0, max = 100, id, className }: Props) => {
    const high = value > 80 ? 80 : 50;
    return (
        <meter
            aria-describedby={id}
            className={classnames([className, value > 80 && 'is-high'])}
            high={high}
            low={low}
            value={value}
            min={min}
            max={max}
        />
    );
};

export default Meter;
