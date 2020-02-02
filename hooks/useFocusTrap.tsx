import { KeyboardEvent, useCallback, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]',
    'a[href]',
    'audio[controls]',
    'button',
    'iframe',
    'input',
    'select',
    'textarea',
    'video[controls]'
].join(',');

const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab') {
        return;
    }

    const { activeElement } = document;

    const focusableNodes = e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);

    const first = focusableNodes[0];
    const last = focusableNodes[focusableNodes.length - 1];

    const withShiftKey = e.shiftKey;
    if (activeElement === first && withShiftKey) {
        e.preventDefault();
        e.stopPropagation();
        last.focus();
    } else if (activeElement === last && !withShiftKey) {
        e.preventDefault();
        e.stopPropagation();
        first.focus();
    }
};

const useFocusTrap = () => {
    const nodeToRestoreRef = useRef<HTMLElement | null>(null);

    // The node to restore is intended to be the element that caused the focus trap to be active.
    // It has to run before the dom element is rendered in case it has elements that are using autoFocus
    // so useEffect or useLayoutEffect can't be used because they are run too late.
    if (!nodeToRestoreRef.current) {
        nodeToRestoreRef.current = document.activeElement as HTMLElement;
    }

    // A callback ref is used
    const handleRef = useCallback((el: HTMLElement) => {
        if (!el) {
            if (nodeToRestoreRef.current) {
                const nodeToRestore = nodeToRestoreRef.current;
                nodeToRestoreRef.current = null;
                // In a set timeout to allow disabled to restore
                setTimeout(() => {
                    nodeToRestore.focus();
                }, 0);
            }
            return;
        }

        const first = el.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
        if (first && !el.contains(document.activeElement)) {
            first.focus();
        }
    }, []);

    return {
        ref: handleRef,
        onKeyDown: handleKeyDown
    };
};

export default useFocusTrap;
