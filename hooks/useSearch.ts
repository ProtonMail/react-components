import { sanitizeString } from 'proton-shared/lib/sanitize';
import { ReactNode, useCallback, useMemo, useState, KeyboardEvent } from 'react';
import { getMatch } from './helpers/search';

function useSearch<T extends { [key in keyof T]: string }, K = Extract<keyof T, string>>({
    inputValue = '',
    minSymbols = 1,
    onSelect,
    resetField,
    sources,
    keys,
}: {
    inputValue?: string;
    minSymbols?: number;
    onSelect: (item: T) => void;
    resetField: () => void;
    sources: ((match: string) => T[])[];
    keys?: K[];
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedSuggest, setSelectedSuggest] = useState<number | undefined>();

    const searchSuggestions = useMemo(() => {
        const matchString = sanitizeString(inputValue).toLowerCase();
        if (matchString.length < minSymbols || !isFocused) return [];
        const itemList = sources.flatMap((source) => source(matchString));
        const results = itemList
            .map((item) => {
                const matchedProps: { [Prop in keyof T]?: ReactNode } = {};
                const keyList = keys || Object.keys(item);
                for (const prop of keyList) {
                    const content = item[prop as keyof T];
                    const match = content && getMatch(content, matchString);
                    if (match) matchedProps[prop as keyof T] = match;
                }
                return { item, matchedProps };
            })
            .filter(({ matchedProps }) => Object.keys(matchedProps).length > 0);
        return results;
    }, [inputValue, isFocused, sources]);

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
                        setIsFocused(false);
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
    const onBlur = useCallback(() => setTimeout(() => setIsFocused(false), 100), [isFocused]);

    return {
        inputProps: { onKeyDown, onBlur, onFocus },
        searchSuggestions,
        selectedSuggest,
        setIsFocused,
    };
}

export default useSearch;
