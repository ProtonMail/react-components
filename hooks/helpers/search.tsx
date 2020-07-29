import React from 'react';

// remove unicode accents for easier search
const normalize = (input: string) =>
    input
        .normalize('NFD')
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '');

/**
 *  Returns a formatted JSX with all matches wrapped with <b></b>
 *
 * @param {(string | undefined)} input
 * @param {string} match
 * @returns
 */
export const getMatch = (input: string | undefined, match: string) => {
    if (!input) return input;
    const parts = normalize(input).split(match);
    if (parts.length < 2) return;
    const { result } = parts.reduce(
        (acc, part, partIdx) => {
            const matchPart = (
                <>
                    {acc.result}
                    {input.substr(acc.currentIdx, part.length)}
                    {partIdx !== parts.length - 1 && <b>{match}</b>}
                </>
            );
            return { result: matchPart, currentIdx: acc.currentIdx + part.length + match.length };
        },
        { result: <></>, currentIdx: 0 }
    );
    return result;
};
