import { sanitizeString } from 'proton-shared/lib/sanitize';
import { ChangeEvent, ReactNode, useCallback, useMemo, useState, KeyboardEvent } from 'react';
import { getMatch } from './helpers/search';

function useSearch<T>({
    onSelect,
    sources,
    keys,
}: {
    onSelect: (item: T) => void;
    sources: ((match: string) => T[])[];
    keys: string[];
}) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedSuggest, setSelectedSuggest] = useState<number | undefined>();

    const searchSuggestions = useMemo(() => {
        const matchString = inputValue.toLowerCase();
        if (matchString.length < 1 || !isFocused) return [];
        const itemList = sources.flatMap((source) => source(matchString));
        const results = itemList
            .map((item) => {
                const matchedProps: { [key: string]: ReactNode } = {};
                for (const prop of keys) {
                    const content = ((item as unknown) as { [key: string]: unknown })[prop];
                    const match = content && getMatch(content as string, matchString);
                    if (match) matchedProps[prop] = match;
                }
                return { item, matchedProps };
            })
            .filter(({ matchedProps }) => Object.keys(matchedProps).length > 0);
        return results;
    }, [inputValue, isFocused, sources]);

    const resetField = useCallback(() => {
        setInputValue('');
        setIsFocused(false);
    }, [setInputValue, setIsFocused]);

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(sanitizeString(event.currentTarget?.value || ''));
        setSelectedSuggest(undefined);
    }, []);
    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case 'Escape': {
                    event.preventDefault();
                    setIsFocused(false);
                    break;
                }
                case 'Tab':
                case 'Enter': {
                    event.preventDefault();
                    const firstSuggestion = searchSuggestions[0]?.item;
                    if (firstSuggestion) {
                        onSelect(firstSuggestion);
                        resetField();
                    }
                    break;
                }
                case 'ArrowDown': {
                    if (!searchSuggestions.length) return;
                    event.preventDefault();
                    const newSelectedSuggest =
                        selectedSuggest !== undefined ? (selectedSuggest + 1) % searchSuggestions.length : 0;
                    setSelectedSuggest(newSelectedSuggest);
                    break;
                }
                case 'ArrowUp': {
                    if (!searchSuggestions.length) return;
                    event.preventDefault();
                    const newSelectedSuggest =
                        selectedSuggest !== undefined
                            ? (selectedSuggest + searchSuggestions.length - 1) % searchSuggestions.length
                            : searchSuggestions.length - 1;
                    setSelectedSuggest(newSelectedSuggest);
                    break;
                }
                default:
            }
        },
        [selectedSuggest, setSelectedSuggest, searchSuggestions]
    );
    const onFocus = useCallback(() => setIsFocused(true), [isFocused]);
    const onBlur = useCallback(() => setTimeout(resetField, 100), [isFocused, setSelectedSuggest]);

    return {
        inputProps: { value: inputValue, onChange, onKeyDown, onBlur, onFocus },
        searchSuggestions,
        selectedSuggest,
        resetField,
    };
}

export default useSearch;
