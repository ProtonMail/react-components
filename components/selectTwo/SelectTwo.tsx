import React, { useState, useRef, useEffect } from 'react';
import isDeepEqual from 'proton-shared/lib/helpers/isDeepEqual';

import { Dropdown, DropdownButton } from '../dropdown';
import { Props as DropdownButtonProps } from '../dropdown/DropdownButton';
import { Props as OptionProps } from '../option/Option';

export type FakeSelectChangeEvent<V> = {
    value: V;
    selectedIndex: number;
};

export interface Props<V> extends Omit<DropdownButtonProps, 'value' | 'onClick' | 'onChange' | 'onKeyDown'> {
    value?: V;
    isOpen?: boolean;
    children: React.ReactElement<OptionProps<V>>[];
    clearSearchAfter?: number;
    getSearchableValue?: (value: V) => string;
    onChange?: (e: FakeSelectChangeEvent<V>) => void;
    onClose?: () => void;
    onOpen?: () => void;
}

const Select = <V extends any>({
    children,
    value,
    placeholder,
    isOpen: controlledOpen,
    onClose,
    onOpen,
    onChange: onChangeProp,
    clearSearchAfter = 500,
    getSearchableValue,
    ...rest
}: Props<V>) => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    const [search, setSearch] = useState('');

    const searchClearTimeout = useRef<number | undefined>(undefined);

    const isControlled = controlledOpen !== undefined;

    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const allOptionValues = children.map((child) => child.props.value);

    /*
     * Natural search-ability determined by whether or not all option values
     * from the passed children are strings, there's also "unnatural" search-ability
     * if the prop "getSearchableValue" is passed
     */
    const isNaturallySearchable = allOptionValues.every((child) => typeof child === 'string');

    const isSearchable = isNaturallySearchable || Boolean(getSearchableValue);

    let selectedIndex: number | null = null;

    React.Children.forEach(children, (child, index) => {
        if (isDeepEqual(child.props.value, value)) {
            selectedIndex = index;
        }
    });

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
            (getSearchableValue?.(v) || (v as string)).startsWith(search)
        );

        if (indexOfMatchedOption !== -1) {
            setFocusedIndex(indexOfMatchedOption);
        }
    }, [search]);

    function open() {
        if (isControlled) {
            onOpen?.();
        } else {
            setUncontrolledOpen(true);
        }

        setFocusedIndex(selectedIndex || 0);
    }

    function close() {
        if (isControlled) {
            onClose?.();
        } else {
            setUncontrolledOpen(false);
        }
    }

    function goToPreviousItem() {
        if (focusedIndex !== null && focusedIndex !== 0) {
            setFocusedIndex(focusedIndex - 1);
        }
    }

    function goToNextItem() {
        if (focusedIndex !== null && focusedIndex !== children.length - 1) {
            setFocusedIndex(focusedIndex + 1);
        }
    }

    function handleAnchorClick() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    function handleAnchorKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
        switch (e.key) {
            case ' ':
            case 'Enter': {
                open();
                break;
            }
            default:
        }
    }

    function handleChange(event: FakeSelectChangeEvent<V>) {
        onChangeProp?.(event);
    }

    function handleMenuKeydown(e: React.KeyboardEvent<HTMLUListElement>) {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault();
                goToPreviousItem();
                break;
            }

            case 'ArrowDown': {
                e.preventDefault();
                goToNextItem();
                break;
            }

            case 'Escape': {
                close();
                anchorRef.current?.focus();
                break;
            }

            default:
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
    }

    function handleChildChange(index: number) {
        return (value: V) => {
            handleChange({ value, selectedIndex: index });
        };
    }

    const items = React.Children.map(children, (child, index) => {
        const childValue = children[index].props.value;

        const selected = isDeepEqual(childValue, value);

        return React.cloneElement(child, {
            selected,
            active: focusedIndex === index,
            onChange: handleChildChange(index),
        });
    });

    const displayedValue: React.ReactNode =
        selectedIndex || selectedIndex === 0 ? children[selectedIndex].props.children : placeholder;

    return (
        <>
            <DropdownButton
                style={{ width: '100%', listStyleType: 'none' }}
                className="alignleft ellipsis no-outline"
                isOpen={isOpen}
                hasCaret
                buttonRef={anchorRef}
                onClick={handleAnchorClick}
                onKeyDown={handleAnchorKeydown}
                {...rest}
            >
                {displayedValue}
            </DropdownButton>

            <Dropdown
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
                offset={4}
                noCaret
                noMaxWidth
                sameAnchorWidth
            >
                <ul
                    style={{ listStyleType: 'none', padding: 0, margin: 0 }}
                    onKeyDown={handleMenuKeydown}
                    data-testid="select-list"
                >
                    {items}
                </ul>
            </Dropdown>
        </>
    );
};

export default Select;
