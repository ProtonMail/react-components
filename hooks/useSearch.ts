import { sanitizeString } from 'proton-shared/lib/sanitize';
import { ReactNode, useCallback, useMemo, useState, KeyboardEvent } from 'react';
import { getMatch } from './helpers/search';

// should result in an object that only has values from T that are assignable to string
type SearchableObject<T> = { [Key in KeyOfUnion<T>]: T[KeyOfUnion<T>] extends string ? T[KeyOfUnion<T>] : undefined };
type KeyOfUnion<T> = T extends any ? keyof T : never;

/**
 *useSearch hook
 *
 * @template T Type of entries, could be union
 * @param sources Array of functions returning entries
 * @param keys Array of entries' keys to search, all by default
 * @param mapFn Function that accepts a list of items collected from sources and returns a list items, do sorting/filter here
 * @param inputValue Search string
 * @param minSymbols Minimum symbols to start searching
 * @param resetField
 * @param onSelect
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
    mapFn?: (items: SearchableObject<T>[]) => T[];
    resetField: () => void;
    sources: ((match: string) => T[])[];
    keys?: K[];
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedSuggest, setSelectedSuggest] = useState<number | undefined>();

    const searchSuggestions = useMemo(() => {
        const matchString = sanitizeString(inputValue).toLowerCase();
        if (matchString.length < minSymbols || !isFocused) return [];
        let itemList = sources.flatMap((source) => source(matchString));
        // theoretically, this is an error in types, but it's the only way to let typescript
        // typecheck keys and mapFn arguments without doing the work in runtime
        if (mapFn) itemList = mapFn((itemList as unknown) as SearchableObject<T>[]);
        const results = itemList
            .map((item) => {
                const matchedProps: { [key in KeyOfUnion<T>]?: ReactNode } = {};
                // when keys are not defined we still pick only searchable keys
                const keyList = (keys ||
                    Object.keys(item).filter((key) => typeof item[key as KeyOfUnion<T>] === 'string')) as KeyOfUnion<
                    T
                >[];
                for (const prop of keyList) {
                    const content = item[prop];
                    const match = content && typeof content === 'string' && getMatch(content, matchString);
                    if (match) matchedProps[prop] = match;
                }
                return { item, matchedProps };
            })
            .filter(({ matchedProps }) => Object.keys(matchedProps).length > 0);
        return results;
    }, [inputValue, isFocused, sources, mapFn]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            const totalSuggestions = searchSuggestions.length;
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
                    if (!totalSuggestions) return;
                    event.preventDefault();
                    const newSelectedSuggest =
                        selectedSuggest !== undefined ? (selectedSuggest + 1) % totalSuggestions : 0;
                    setSelectedSuggest(newSelectedSuggest);
                    break;
                }
                case 'ArrowUp': {
                    if (!totalSuggestions) return;
                    event.preventDefault();
                    const newSelectedSuggest =
                        selectedSuggest !== undefined
                            ? (selectedSuggest + totalSuggestions - 1) % totalSuggestions
                            : totalSuggestions - 1;
                    setSelectedSuggest(newSelectedSuggest);
                    break;
                }
                default:
            }
        },
        [selectedSuggest, setSelectedSuggest, searchSuggestions]
    );
    const onFocus = useCallback(() => setIsFocused(true), [setIsFocused]);
    const onBlur = useCallback(() => setTimeout(() => setIsFocused(false), 100), [setIsFocused]);

    return {
        inputProps: { onKeyDown, onBlur, onFocus },
        searchSuggestions,
        selectedSuggest,
        setIsFocused,
    };
}

export default useSearch;
