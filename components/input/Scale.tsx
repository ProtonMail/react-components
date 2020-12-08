import React from 'react';
import { range } from 'proton-shared/lib/helpers/array';

import InputButton from './InputButton';

interface ScaleProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    from: number;
    to: number;
    startLabel: string;
    endLabel: string;
    value?: number;
    onChange: (value: number) => void;
}

const Scale = ({ from, to, startLabel, endLabel, value, onChange, ...rest }: ScaleProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    const scale = range(from, to + 1);

    return (
        <div {...rest}>
            <div className="flex flex-spacebetween">
                {scale.map((n, index) => (
                    <InputButton
                        key={n}
                        id={`score-${n}`}
                        name="score"
                        type="radio"
                        value={n}
                        title={String(n)}
                        checked={value === n}
                        labelProps={{ className: index !== scale.length - 1 ? 'mr0-5' : undefined }}
                        onChange={handleChange}
                    >
                        {n}
                    </InputButton>
                ))}
            </div>
            <div className="flex flex-spacebetween mt0-5">
                <span className="small m0 color-global-altgrey">{startLabel}</span>
                <span className="small m0 color-global-altgrey">{endLabel}</span>
            </div>
        </div>
    );
};

export default Scale;
