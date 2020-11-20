import React, { AriaAttributes, useEffect, useRef, useState } from 'react';

import useControlled from '../../hooks/useControlled';
import { Dropdown } from '../dropdown';
import { Option } from '../option';

export interface AutocompleteChangeEvent<V> {
    value: V;
}

interface RenderProps<V> {
    value: V;
    input: string;
    'aria-owns': AriaAttributes['aria-owns'];
    'aria-activedescendant': AriaAttributes['aria-activedescendant'];
    'aria-autocomplete': AriaAttributes['aria-autocomplete'];
    ref: React.RefObject<any>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface FilterOptionsParameters<V> {
    input: string;
    options: V[];
    getOptionLabel: (v: V) => string;
}

function arrayRemove<T>(array: T[], item: T) {
    const index = array.indexOf(item);

    return [...array.slice(0, index), ...array.slice(index + 1)];
}

const defaultFilterOptions = <V extends any>({ input, options, getOptionLabel }: FilterOptionsParameters<V>) =>
    options.filter((option) => input && new RegExp(input).test(getOptionLabel(option)));

interface Props<V, Multiple extends undefined | boolean = undefined> {
    /**
     * Required for accessibility, namely linking
     * aria-owns & aria-activedescendant correctly.
     *
     * Should be unique per autocomplete-instance.
     */
    id: string;
    /**
     * The current value of the autocomplete.
     * Uses identity equivalence with items from
     * the options Array to determine which option
     * is currently selected.
     */
    value: Multiple extends undefined | false ? V : V[];
    /**
     * Puts your Autocomplete instance in 'multiple' mode
     * where the value emitted will be an array of values.
     *
     * In this configuration 'value' has to be an array.
     */
    multiple?: Multiple;
    /**
     * The options available for selection from the
     * autocomplete. Certain values used internally
     * are computed from this option props (e.g. the
     * React 'key' for iterative rendering of the option
     * children, the displayed value and therefore the
     * string  used for the search & highlight feature
     * etc.)
     *
     * This prop is generic, however if it doesn't follow
     * the pattern of `{ key, label }` you need to provide
     * "getOptionLabel" and/or "getOptionKey" in order for
     * the component to function properly.
     */
    options: V[];
    /**
     * Let's the consumer optionally control the open
     * state of the dropdown component
     */
    isOpen?: boolean;
    /**
     * Filtering function that decided which options from the
     * options array should be rendered.
     */
    filterOptions?: (params: FilterOptionsParameters<V>) => V[];
    /**
     * Computes the displayed value of a given option.
     * This is required for proper functionality should your options
     * not contain a "label" property.
     */
    getOptionLabel?: (v: V) => string;
    /**
     * Computes the React "key" necessary for iterative rendering of
     * each option. This is required for proper functionality should your
     * options not contain a "key" property.
     */
    getOptionKey?: (v: V) => string;
    /**
     * Render props children responsible for rendering the anchor element.
     */
    children: (props: RenderProps<Multiple extends undefined | false ? V | null : V[]>) => React.ReactElement;
    /**
     * Fired when the autocomplete dropdown is closed.
     */
    onClose?: () => void;
    /**
     * Fired when the autocomplete value changed.
     */
    onChange?: (e: AutocompleteChangeEvent<Multiple extends undefined | false ? V : V[]>) => void;
}

const AutocompleteTwo = <V, Multiple extends boolean | undefined = undefined>({
    id,
    options,
    value: valueProp,
    multiple,
    isOpen: isOpenProp,
    getOptionLabel = (v: any) => v.label,
    getOptionKey = (v: any) => v.key,
    filterOptions = defaultFilterOptions,
    children,
    onClose,
    onChange,
}: Props<V, Multiple>) => {
    type ValueOrValueArray = Multiple extends undefined | false ? V : V[];

    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const [input, setInput] = useState('');

    const [isOpen, setIsOpen] = useControlled(isOpenProp, false);

    const [value, setValue] = useControlled(valueProp);

    const anchorRef = useRef<HTMLElement>(null);

    useEffect(() => {
        /*
         * The number of items displayed in the
         * dropdown as well as which set of items is displayed is
         * prone to change as the value  of "input" changes.
         *
         * Selection preservation based on index can't be reliably dealt
         * with, hence we reset index highlighting to the first element
         * on any input change, given that it is not "0" already.
         */
        if (highlightedIndex !== 0) {
            setHighlightedIndex(0);
        }
    }, [input]);

    const filteredOptions = filterOptions({
        input,
        options,
        getOptionLabel,
    });

    const matches = filteredOptions.map((option) =>
        Array.from(getOptionLabel(option).matchAll(new RegExp(input, 'g')))
    );

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        onClose?.();
    };

    const goToPreviousOption = () => {
        setHighlightedIndex((currentHighlightedIndex) =>
            currentHighlightedIndex === 0 ? currentHighlightedIndex : currentHighlightedIndex - 1
        );
    };

    const goToNextOption = () => {
        setHighlightedIndex((currentHighlightedIndex) =>
            currentHighlightedIndex === filteredOptions.length - 1
                ? currentHighlightedIndex
                : currentHighlightedIndex + 1
        );
    };

    const getNextValue = (option: V) => {
        if (multiple && !Array.isArray(value)) {
            throw new Error('In "multiple" mode value  must be an array.');
        }

        if (multiple) {
            if ((value as V[]).includes(option)) {
                return arrayRemove(value as V[], option) as ValueOrValueArray;
            }

            return [...(value as V[]), option] as ValueOrValueArray;
        }

        return value as ValueOrValueArray;
    };

    const selectCurrentlyHighlightedOption = () => {
        const option = filteredOptions[highlightedIndex];

        if (!option) {
            return;
        }

        const nextValue = getNextValue(option);

        onChange?.({ value: nextValue });
        setValue(nextValue);

        if (!multiple) {
            setInput(getOptionLabel(option));
            close();
        }
    };

    const handleChange = (option: V) => {
        const nextValue = getNextValue(option);

        onChange?.({ value: nextValue });
        setValue(nextValue);

        if (!multiple) {
            setInput(getOptionLabel(option));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);

        if (!isOpen) {
            open();
        }
    };

    const handleInputFocus = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault();
                goToPreviousOption();
                break;
            }

            case 'ArrowDown': {
                e.preventDefault();
                goToNextOption();
                break;
            }

            case 'Enter': {
                e.preventDefault();
                selectCurrentlyHighlightedOption();
                break;
            }

            default:
        }
    };

    const renderOption = (option: V, index: number) => {
        const match = matches[index];

        const label = getOptionLabel(option);

        const highlightedLabel: React.ReactNode[] = [];

        let lastMatchIndex = 0;

        match.forEach((matchItem) => {
            const [matchedString] = matchItem;

            highlightedLabel.push(label.slice(lastMatchIndex, matchItem.index), <mark>{matchedString}</mark>);

            if ((matchItem.index || matchItem.index === 0) && matchedString) {
                lastMatchIndex = matchItem.index + matchedString.length;
            }
        });

        highlightedLabel.push(label.slice(lastMatchIndex));

        const selected = multiple ? (value as V[]).includes(option) : value === option;

        return (
            <Option
                key={getOptionKey(option)}
                id={`${id}-${index}`}
                title={getOptionLabel(option)}
                value={option}
                onChange={handleChange}
                active={highlightedIndex === index}
                selected={selected}
                focusOnActive={false}
            >
                {highlightedLabel}
            </Option>
        );
    };

    const renderProps: RenderProps<ValueOrValueArray> = {
        input,
        value,
        'aria-owns': id,
        'aria-activedescendant': `${id}-${highlightedIndex}`,
        'aria-autocomplete': 'list',
        ref: anchorRef,
        onChange: handleInputChange,
        onFocus: handleInputFocus,
        onKeyDown: handleInputKeyDown,
    };

    return (
        <>
            {children(renderProps)}

            <Dropdown
                autoClose={false}
                isOpen={Boolean(filteredOptions.length > 0 && isOpen)}
                anchorRef={anchorRef}
                onClose={handleClose}
                offset={4}
                noCaret
                noMaxWidth
                sameAnchorWidth
                UNSTABLE_AUTO_HEIGHT
            >
                <ul id={id} className="unstyled m0 p0">
                    {filteredOptions.map(renderOption)}
                </ul>
            </Dropdown>
        </>
    );
};

export default AutocompleteTwo;
