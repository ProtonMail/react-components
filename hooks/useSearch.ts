import { sanitizeString } from 'proton-shared/lib/sanitize';
import { ReactNode, useCallback, useMemo, useState, KeyboardEvent } from 'react';
import { getMatch } from './helpers/search';

// should result in an object that only has values from T that are assignable to string
type SearchableObject<T> = { [Key in keyof T]: T[keyof T] extends string ? T[keyof T] : undefined };

/**
 * NB: if sources return different types, & them. This allows to pick keys that only exist on one of the types.
 */
function useSearch<T, K = keyof SearchableObject<T>>({
    inputValue = '',
    minSymbols = 1,
    mapFn,
    onSelect,
    resetField,
    sources,
    keys,
}: {
    inputValue?: string;
    minSymbols?: number;
    onSelect: (item: Partial<T>) => void;
    mapFn?: (items: Partial<T>[]) => Partial<T>[];
    resetField: () => void;
    sources: ((match: string) => Partial<T>[])[];
    keys?: K[];
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedSuggest, setSelectedSuggest] = useState<number | undefined>();

    const searchSuggestions = useMemo(() => {
        const matchString = sanitizeString(inputValue).toLowerCase();
        if (matchString.length < minSymbols || !isFocused) return [];
        let itemList = sources.flatMap((source) => source(matchString));
        // here you can do all filtering/sorting you want
        if (mapFn) itemList = mapFn(itemList);
        const results = itemList
            .map((item) => {
                const matchedProps: { [key in keyof SearchableObject<T>]?: ReactNode } = {};
                // when keys are not defined we still pick only searchable keys
                const keyList = (keys ||
                    Object.keys(item).filter((key) => typeof item[key as keyof T] === 'string')) as K[];
                for (const prop of keyList) {
                    const content = item[(prop as unknown) as keyof T];
                    const match = content && typeof content === 'string' && getMatch(content, matchString);
                    if (match) matchedProps[(prop as unknown) as keyof T] = match;
                }
                return { item, matchedProps };
            })
            .filter(({ matchedProps }) => Object.keys(matchedProps).length > 0);
        return results;
    }, [inputValue, isFocused, sources, mapFn]);

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
