import React from 'react';

import { classnames } from '../../helpers';

interface Props extends React.ComponentPropsWithoutRef<'meter'> {
    /** which variant of the meter to use */
    variant?: 'thin' | 'default';
}

export enum MeterValue {
    Optimum = 0,
    Min = 0,
    Low = 50,
    High = 80,
    Max = 100,
}

const { Optimum, Min, Low, High, Max } = MeterValue;

const Meter = ({
    variant = 'default',
    min = Min,
    low = Low,
    high = High,
    max = Max,
    optimum = Optimum,
    id,
    className: classNameProp,
    ...rest
}: Props) => {
    const className = classnames(['meter-bar', variant === 'thin' && 'is-thin', classNameProp]);

    return (
        <meter
            id={id}
            aria-describedby={id}
            className={className}
            min={min}
            low={low}
            high={high}
            max={max}
            optimum={optimum}
            {...rest}
        />
    );
};

export default Meter;
