import { useState } from 'react';

const useAutocomplete = (multiple, initialSelectedItems = []) => {
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
    const [inputValue, setInputValue] = useState(
        multiple || initialSelectedItems.length === 0 ? '' : initialSelectedItems[0].label
    );

    const submit = (item) => {
        setInputValue(multiple ? '' : item.label);
        setSelectedItems((selected) => (multiple ? [...selected, item] : [item]));
    };

    const remove = (i) => {
        setSelectedItems((selected) => [...selected.slice(0, i), ...selected.slice(i + 1)]);
    };

    return {
        changeInputValue: setInputValue,
        selectedItems,
        inputValue,
        submit,
        remove
    };
};

export default useAutocomplete;
