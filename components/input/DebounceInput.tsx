import React, { useState, useEffect } from 'react';

import Input from './Input';
import useDebounceInput from './useDebounceInput';

interface Props {
    onChange: (newValue: string) => void;
    value: string;
    delay?: number;
}

const DebounceInput = ({ onChange, value: initValue, delay, ...rest }: Props) => {
    const [value, setValue] = useState(initValue);
    const debouncedValue = useDebounceInput(value, delay);

    const onUnmount = () => {
        // Save latest value before unmount
        if (debouncedValue !== value) {
            onChange(value);
        }
    };

    useEffect(() => {
        onChange(debouncedValue);
        return onUnmount;
    }, [debouncedValue]);

    return <Input value={value} onChange={({ target }) => setValue(target.value)} {...rest} />;
};

export default DebounceInput;
