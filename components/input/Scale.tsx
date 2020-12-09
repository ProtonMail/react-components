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
            <div className="scale-buttons-container">
                {scale.map((n) => (
                    <InputButton
                        key={n}
                        id={`score-${n}`}
                        name="score"
                        type="radio"
                        value={n}
                        title={String(n)}
                        checked={value === n}
                        onChange={handleChange}
                    >
                        {n}
                    </InputButton>
                ))}
            </div>
            <div className="flex flex-spacebetween mt0-5">
                <span className="small m0">{startLabel}</span>
                <span className="small m0">{endLabel}</span>
            </div>
        </div>
    );
};

export default Scale;
