import React, { useEffect, useRef, useState } from 'react';

const manager = (() => {
    const data: any[] = [];
    return {
        add: (item: any) => {
            data.push(item);
            return () => {
                const idx = data.indexOf(item);
                if (idx === -1) {
                    return;
                }
                data.splice(idx, 1);
            };
        },
        isLast: (item: any) => (data.length ? data[data.length - 1] === item : false),
    };
})();

interface Props {
    children: React.ReactNode;
    disableAutoFocus?: boolean;
    disableEnforceFocus?: boolean;
    open?: boolean;
    restoreFocus?: boolean;
}

const FocusTrap = ({
    children,
    open = true,
    restoreFocus = true,
    disableAutoFocus = false,
    disableEnforceFocus = false,
}: Props) => {
    const [id] = useState({});

    const ignoreNextEnforceFocus = React.useRef(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const sentinelStart = useRef<HTMLDivElement>(null);
    const sentinelEnd = useRef<HTMLDivElement>(null);
    const nodeToRestoreRef = useRef<Element | null>(null);
    const prevOpenRef = useRef(false);

    useEffect(() => {
        prevOpenRef.current = open;
    }, [open]);

    if (!prevOpenRef.current && open && typeof window !== 'undefined') {
        nodeToRestoreRef.current = document.activeElement;
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        const remove = manager.add(id);
        const isEnabled = () => manager.isLast(id);

        const doc = document;

        // We might render an empty child.
        if (!disableAutoFocus && rootRef.current && !rootRef.current.contains(doc.activeElement)) {
            if (!rootRef.current.hasAttribute('tabIndex')) {
                rootRef.current.setAttribute('tabIndex', '-1');
            }
            rootRef.current.focus();
        }

        const contain = () => {
            const { current: rootElement } = rootRef;
            // Cleanup functions are executed lazily in React 17.
            // Contain can be called between the component being unmounted and its cleanup function being run.
            if (rootElement === null) {
                return;
            }

            if (!doc.hasFocus() || disableEnforceFocus || !isEnabled() || ignoreNextEnforceFocus.current) {
                ignoreNextEnforceFocus.current = false;
                return;
            }

            if (rootRef.current && !rootRef.current.contains(doc.activeElement)) {
                rootRef.current.focus();
            }
        };

        const loopFocus = (event: KeyboardEvent) => {
            // 9 = Tab
            if (disableEnforceFocus || !isEnabled() || event.keyCode !== 9) {
                return;
            }

            // Make sure the next tab starts from the right place.
            if (doc.activeElement === rootRef.current) {
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

        doc.addEventListener('focus', contain, true);
        doc.addEventListener('keydown', loopFocus, true);

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

            doc.removeEventListener('focus', contain, true);
            doc.removeEventListener('keydown', loopFocus, true);

            remove();

            if (restoreFocus) {
                const nodeToRestore = nodeToRestoreRef.current as HTMLElement;
                nodeToRestore?.focus?.();
            }
            nodeToRestoreRef.current = null;
        };
    }, [open]);

    return (
        <>
            <div tabIndex={0} ref={sentinelStart} data-test="sentinelStart" />
            <div tabIndex={-1} ref={rootRef}>
                {children}
            </div>
            <div tabIndex={0} ref={sentinelEnd} data-test="sentinelEnd" />
        </>
    );
};

export default FocusTrap;
