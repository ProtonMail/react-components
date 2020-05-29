import React from 'react';

import { classnames } from '../../helpers/component';

interface Props {
    value?: number;
    max?: number;
    id?: string;
    className?: string;
}

const Progress = ({ value = 50, max = 100, id, className }: Props) => {
    return (
        <progress
            aria-describedby={id}
            className={classnames(['progressbar w100', className])}
            value={value}
            max={max}
        />
    );
};

export default Progress;
