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

    const remove = (index) => {
        setSelectedItems((selected) => selected.filter((_, i) => i !== index));
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
