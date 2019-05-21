import { useState, useEffect } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';

const defaultLabelToItem = (label) => label;

const useAutocomplete = ({
    multiple = true,
    initialSelectedItems = [],
    initialInputValue = '',
    labelToItem = defaultLabelToItem,
    onChange = noop
} = {}) => {
    const [initialized, setInitialized] = useState(false);
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
    const [inputValue, changeInputValue] = useState(initialInputValue);

    // We want to emit onChange when items are selected or removed,
    // but not with the initial values on mount
    useEffect(() => {
        if (initialized) {
            onChange(selectedItems);
        } else {
            setInitialized(true);
        }
    }, [selectedItems]);

    const select = (item, label) => {
        changeInputValue(multiple ? '' : label);

        const itemToAdd = !item && label ? labelToItem(label) : item;
        setSelectedItems((selected) => (multiple ? [...selected, itemToAdd] : [itemToAdd]));
    };

    const submit = (label) => select(null, label);

    const deselect = (index) => {
        setSelectedItems((selected) => selected.filter((_, i) => i !== index));
    };

    return {
        changeInputValue,
        selectedItems,
        inputValue,
        submit,
        select,
        deselect
    };
};

export default useAutocomplete;
