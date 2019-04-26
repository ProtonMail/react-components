import { useState } from 'react';

/**
 *
 * @param {Object|Array} initialSelected { label, value } or Array<{ label, value }> for multiple
 * @param {boolean} multiple is multi-select input
 *
 * @returns {Object} {
 *     selected: { label, value } or Array<{ label, value }> for multiple
 * }
 */
const useAutocomplete = (multiple, initialSelected) => {
    const defaultSelected = multiple ? [] : undefined;
    const [selected, setSelected] = useState(defaultSelected);
    const [inputValue, setInputValue] = useState(multiple || !initialSelected ? '' : initialSelected.label);

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
