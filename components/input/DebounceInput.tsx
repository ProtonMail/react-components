import React, { useState, useEffect } from 'react';

import Input from './Input';
import useDebounceInput from './useDebounceInput';

interface Props {
    onChange: (newValue: string) => void;
    value: string;
}

const DebounceInput = ({ onChange, value: initValue, ...rest }: Props) => {
    const [value, setValue] = useState(initValue);
    const debouncedValue = useDebounceInput(value);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    return <Input value={value} onChange={({ target }) => setValue(target.value)} {...rest} />;
};

export default DebounceInput;
