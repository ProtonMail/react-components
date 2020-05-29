import React from 'react';

interface Props {
    min?: number;
    low?: number;
    high?: number;
    max?: number;
    optimum?: number;
    value?: number;
    id?: string;
    className?: string;
}

const Meter = ({ min = 0, low = 50, high = 80, max = 100, optimum = 0, value = 50, id, className }: Props) => {
    return (
        <meter
            aria-describedby={id}
            className={className}
            min={min}
            low={low}
            high={high}
            max={max}
            optimum={optimum}
            value={value}
        />
    );
};

export default Meter;
