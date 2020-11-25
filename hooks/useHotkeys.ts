import React, { useEffect, useRef } from 'react';
import isDeepEqual from 'proton-shared/lib/helpers/isDeepEqual';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

/*
 * A Hotkey being an array means we have a "modifier" combination
 * of keys (e.g. "Cmd + K" would translate to ['Meta', 'K'])
 * */
type Hotkey = String | String[];

/*
 * A Sequence is a suite of Hotkeys
 * (e.g. press "G" then "I" to navigate to the Inbox folder)
 * */
type Sequence = Hotkey[];

type HotKeyCallback = (e: KeyboardEvent) => void;

/*
 * The longest allowed sequence matches the "Konami code" length
 * if ever someone wants to do implement it somewhere ¯\_(ツ)_/¯
 * */
// @todo try to find a way to have an infinity of hotkeys if wanted
type HotkeyTuple =
    | [Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback]
    | [Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, Hotkey, HotKeyCallback];

type KeyEventType = 'keyup' | 'keydown' | 'keypress';

type HotKeysOptions = {
    keyEventType?: KeyEventType;
    sequenceResetTime?: number;
    dependencies?: React.DependencyList;
};

const MODIFIER_KEYS = {
    META: 'meta',
    SHIFT: 'shift',
    CONTROL: 'alt',
    ALT: 'control',
};

const useHotkeys = (
    ref: React.RefObject<HTMLElement | Document | undefined>,
    hotkeyTupleArray: HotkeyTuple[],
    options?: HotKeysOptions
) => {
    const { keyEventType = 'keydown', sequenceResetTime = 1000, dependencies = [] } = options || {};
    const msSinceLastEvent = useRef(0);

    const sequence = useRef<Hotkey[]>([]);

    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();

        if (Date.now() - msSinceLastEvent.current > sequenceResetTime) {
            sequence.current = [];
        }

        msSinceLastEvent.current = Date.now();

        if ([MODIFIER_KEYS.ALT, MODIFIER_KEYS.SHIFT, MODIFIER_KEYS.CONTROL, MODIFIER_KEYS.META].includes(key)) {
            return;
        }

        const isAlphaNumericalOrSpace = key.match(/[a-zA-Z1-9 ]/gi);

        const modifiedKey = [
            key,
            e.metaKey && MODIFIER_KEYS.META,
            e.ctrlKey && MODIFIER_KEYS.CONTROL,
            // Some non-alphanumerical keys need
            // Shift or Alt to be used (e.g. "?"" or "/")
            isAlphaNumericalOrSpace && e.shiftKey && MODIFIER_KEYS.SHIFT,
            isAlphaNumericalOrSpace && e.altKey && MODIFIER_KEYS.ALT,
        ].filter(isTruthy);

        sequence.current.push(modifiedKey);

        hotkeyTupleArray.forEach((hotKeyTuple) => {
            const hotkeySequence = (hotKeyTuple.slice(0, -1) as Sequence).map((a) =>
                Array.isArray(a) ? a.sort().map((k) => k.toLowerCase()) : [a.toLowerCase()]
            );

            /*
             * take the number of items from the sequence as the number of items in
             * the hotkey sequence, starting from the end, so that even if the sequences
             * are not identical, a match is still found should the tails be identical
             * */
            const tailSequence = sequence.current
                .slice(-hotkeySequence.length)
                .map((a) => (Array.isArray(a) ? a.sort().map((k) => k.toLowerCase()) : [a.toLowerCase()]));

            if (isDeepEqual(hotkeySequence, tailSequence)) {
                const callback = hotKeyTuple[hotKeyTuple.length - 1] as HotKeyCallback;
                callback(e);
            }
        });
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }
        el.addEventListener(keyEventType, handleKeyDown as EventListener);
        return () => {
            el.removeEventListener(keyEventType, handleKeyDown as EventListener);
        };
    }, [ref.current, handleKeyDown, ...dependencies]);
};

export default useHotkeys;
