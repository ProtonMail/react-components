import React, { useEffect, useRef, useState } from 'react';

const findParentElement = (el: Element | null | undefined, cb: (el: Element) => boolean) => {
    let nextEl = el;
    while (nextEl) {
        if (cb(nextEl)) {
            return nextEl;
        }
        nextEl = nextEl.parentElement;
    }
};

const manager = (() => {
    const data: any[] = [];
    const remove = (item: any) => {
        const idx = data.indexOf(item);
        if (idx === -1) {
            return;
        }
        data.splice(idx, 1);
    };
    return {
        add: (item: any) => {
            data.push(item);
            return () => {
                remove(item);
            };
        },
        isLast: (item: any) => (data.length ? data[data.length - 1] === item : false),
        remove,
    };
})();

interface Props {
    children: React.ReactNode;
    active?: boolean;
    restoreFocus?: boolean;
}

const FocusTrap = ({ children, active = true, restoreFocus = true }: Props) => {
    const [id] = useState({});

    const ignoreNextEnforceFocus = React.useRef(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const sentinelStart = useRef<HTMLDivElement>(null);
    const sentinelEnd = useRef<HTMLDivElement>(null);
    const nodeToRestoreRef = useRef<Element | null>(null);
    const prevOpenRef = useRef(false);

    useEffect(() => {
        prevOpenRef.current = active;
    }, [active]);

    if (!prevOpenRef.current && active && typeof window !== 'undefined') {
        nodeToRestoreRef.current = document.activeElement;
    }

    useEffect(() => {
        if (!active) {
            return;
        }

        const remove = manager.add(id);

        const isEnabled = () => {
            return manager.isLast(id);
        };

        const init = () => {
            const { current: rootElement } = rootRef;
            if (!rootElement) {
                return;
            }
            rootElement.removeAttribute('data-pending');
            if (!isEnabled()) {
                return;
            }
            const hasFocusInTrap = rootElement.contains(document.activeElement);
            if (!hasFocusInTrap) {
                const focusPreferences = rootElement.querySelectorAll('[data-focus-fallback]');
                const ordered = [...focusPreferences].sort(
                    (a, b) => parseInt(a.dataset.focusFallback, 10) - parseInt(b.dataset.focusFallback, 10)
                );
                if (ordered.length) {
                    ordered[0].focus();
                } else {
                    rootElement.focus();
                }
            }
        };

        const contain = () => {
            const { current: rootElement } = rootRef;
            // Cleanup functions are executed lazily in React 17.
            // Contain can be called between the component being unmounted and its cleanup function being run.
            if (!rootElement || !isEnabled()) {
                return;
            }
            const targetFocusContainer = findParentElement(document.activeElement, (el) => {
                const htmlEl = el as HTMLElement;
                return htmlEl.dataset?.test === 'sentinelRoot';
            }) as HTMLElement;
            // A new focus trap is going to become active, abort this contain.
            if (targetFocusContainer?.dataset?.pending) {
                return;
            }
            if (!document.hasFocus() || ignoreNextEnforceFocus.current) {
                ignoreNextEnforceFocus.current = false;
                return;
            }
            // Focus is already in this root.
            if (targetFocusContainer === rootElement) {
                return;
            }
            rootElement?.focus();
        };

        const loopFocus = (event: KeyboardEvent) => {
            if (!isEnabled() || event.key !== 'Tab') {
                return;
            }
            // Make sure the next tab starts from the right place.
            if (document.activeElement === rootRef.current) {
                // We need to ignore the next contain as
                // it will try to move the focus back to the rootRef element.
                ignoreNextEnforceFocus.current = true;
                if (event.shiftKey) {
                    sentinelEnd.current?.focus();
                } else {
                    sentinelStart.current?.focus();
                }
            }
        };

        init();

        document.addEventListener('focus', contain, true);
        document.addEventListener('keydown', loopFocus, true);

        // With Edge, Safari and Firefox, no focus related events are fired when the focused area stops being a focused area
        // e.g. https://bugzilla.mozilla.org/show_bug.cgi?id=559561.
        //
        // The whatwg spec defines how the browser should behave but does not explicitly mention any events:
        // https://html.spec.whatwg.org/multipage/interaction.html#focus-fixup-rule.
        const interval = setInterval(() => {
            contain();
        }, 150);

        return () => {
            clearInterval(interval);
            document.removeEventListener('focus', contain, true);
            document.removeEventListener('keydown', loopFocus, true);

            remove();
            if (restoreFocus) {
                const nodeToRestore = nodeToRestoreRef.current as HTMLElement;
                nodeToRestore?.focus?.();
            }
            nodeToRestoreRef.current = null;
        };
    }, [active]);

    return (
        <>
            <div tabIndex={0} ref={sentinelStart} data-test="sentinelStart" />
            <div tabIndex={-1} ref={rootRef} data-test="sentinelRoot" data-pending="1">
                {children}
            </div>
            <div tabIndex={0} ref={sentinelEnd} data-test="sentinelEnd" />
        </>
    );
};

export default FocusTrap;
