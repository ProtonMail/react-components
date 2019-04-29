import { useState } from 'react';

const useAutocomplete = (multiple, initialSelectedItems = []) => {
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
    const [inputValue, changeInputValue] = useState(
        multiple || initialSelectedItems.length === 0 ? '' : initialSelectedItems[0].label
    );

    const submit = (item) => {
        changeInputValue(multiple ? '' : item.label);
        setSelectedItems((selected) => (multiple ? [...selected, item] : [item]));
    };

    const remove = (index) => {
        setSelectedItems((selected) => selected.filter((_, i) => i !== index));
    };

    return {
        changeInputValue,
        selectedItems,
        inputValue,
        submit,
        remove
    };
};

export default useAutocomplete;
