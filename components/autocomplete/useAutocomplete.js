import { useState } from 'react';

const useAutocomplete = (initialValue, multiple) => {
    const initialSelected = multiple ? [].concat(initialValue) : initialValue;
    const [selected, setSelected] = useState(initialSelected);
    const [inputValue, setInputValue] = useState(multiple ? '' : initialValue);

    const submit = (item) => {
        setInputValue(multiple ? '' : item.label);
        setSelected((selected) => (multiple ? [...selected, item] : item));
    };

    const remove = (i) => {
        setSelected((selected) => [...selected.slice(0, i), ...selected.slice(i + 1)]);
    };

    return {
        changeInputValue: setInputValue,
        selected,
        inputValue,
        submit,
        remove
    };
};

export default useAutocomplete;
