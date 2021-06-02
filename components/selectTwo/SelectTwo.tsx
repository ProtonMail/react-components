import React, { useState, useRef, useEffect, useMemo } from 'react';

import { Dropdown } from '../dropdown';
import { Props as OptionProps } from '../option/Option';
import SelectOptions from './SelectOptions';
import useSelect, { SelectProvider } from './useSelect';
import SelectButton from './SelectButton';

export type FakeSelectChangeEvent<V> = {
    value: V;
    selectedIndex: number;
};

export interface Props<V>
    extends Omit<
        React.ComponentPropsWithoutRef<'button'>,
        'value' | 'onClick' | 'onChange' | 'onKeyDown' | 'aria-label'
    > {
    value?: V;
    /**
     * Optionally allows controlling the Select's open state
     */
    isOpen?: boolean;
    /**
     * Children Options of the Select, have to be of type Option
     * (or something that implements the same interface)
     */
    children: React.ReactElement<OptionProps<V>>[];
    /**
     * Milliseconds after which to clear the current user input
     * (the input is used for highlighting match based on keyboard input)
     */
    clearSearchAfter?: number;
    /**
     * In case you're providing complex values to your options, you can
     * provide a function to return a string given one of your complex
     * value items. This is optional however if you do not provide it and
     * your values are complex, the search feature will be disabled for
     * that instance of the Select.
     */
    getSearchableValue?: (value: V) => string;
    onChange?: (e: FakeSelectChangeEvent<V>) => void;
    onClose?: () => void;
    onOpen?: () => void;
    loading?: boolean;
}

const SelectTwo = <V extends any>({
    children,
    value,
    placeholder,
    className,
    isOpen: controlledOpen,
    onClose,
    onOpen,
    onChange,
    clearSearchAfter = 500,
    getSearchableValue,
    loading,
    ...rest
}: Props<V>) => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const [search, setSearch] = useState('');

    const searchClearTimeout = useRef<number | undefined>(undefined);

    const selectedIndex = useMemo(() => {
        const index = children.findIndex((child) => child.props.value === value);

        return index !== -1 ? index : null;
    }, [children, value]);

    const select = useSelect({
        onChange,
        onOpen,
        onClose,
        selected: selectedIndex,
        numberOfItems: children.length,
    });

    const { isOpen, open, close, setFocusedIndex, handleChange } = select;

    const allOptionValues = children.map((child) => child.props.value);

    /*
     * Natural search-ability determined by whether or not all option values
     * from the passed children are strings, there's also "unnatural" search-ability
     * if the prop "getSearchableValue" is passed
     */
    const isNaturallySearchable = allOptionValues.every((child) => typeof child === 'string');

    const isSearchable = isNaturallySearchable || Boolean(getSearchableValue);

    useEffect(() => {
        if (!search) {
            return;
        }

        if (!isSearchable) {
            return;
        }

        window.clearTimeout(searchClearTimeout.current);

        searchClearTimeout.current = window.setTimeout(() => {
            setSearch('');
        }, clearSearchAfter);

        /*
         * either getSearchableValue is provided or the values are naturally
         * searchable meaning that they are all strings, therefore this
         * type-cast is a safe assumption here
         */
        const indexOfMatchedOption = allOptionValues.findIndex((v) =>
            (getSearchableValue?.(v) || String(v)).startsWith(search)
        );

        if (indexOfMatchedOption !== -1) {
            setFocusedIndex(indexOfMatchedOption);
        }
    }, [search]);

    const handleAnchorClick = () => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    };

    const handleMenuKeydown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        if (e.key === 'Escape') {
            close();
            anchorRef.current?.focus();
            return;
        }

        const isAlphanumeric = /^[a-z0-9]+$/i.test(e.key);

        /*
         * The e.key.length === 1 thing is super hacky and is supposed
         * to prevent event keys such as 'Shift' / 'ArrowUp' etc. from
         * being tracked here.
         *
         * A better solution might be needed.
         */
        if (isAlphanumeric && isSearchable && e.key.length === 1) {
            const { key } = e;

            setSearch((s) => s + key);
        }
    };

    const selectedChild = selectedIndex || selectedIndex === 0 ? children[selectedIndex] : null;

    const displayedValue = selectedChild?.props?.children || selectedChild?.props?.title || placeholder;

    const ariaLabel = selectedChild?.props?.title;

    return (
        <SelectProvider {...select}>
            <SelectButton
                isOpen={isOpen}
                onOpen={open}
                onClick={handleAnchorClick}
                aria-label={ariaLabel}
                ref={anchorRef}
                {...rest}
            >
                {displayedValue}
            </SelectButton>

            <Dropdown
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
                offset={4}
                noCaret
                noMaxWidth
                sameAnchorWidth
            >
                <SelectOptions selected={selectedIndex} onKeyDown={handleMenuKeydown} onChange={handleChange}>
                    {children}
                </SelectOptions>
            </Dropdown>
        </SelectProvider>
    );
};

export default SelectTwo;
