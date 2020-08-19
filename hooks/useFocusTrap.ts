import { MutableRefObject, KeyboardEvent } from 'react';
import { useEventListener } from './useHandler';

const useFocusTrap = (ref: MutableRefObject<HTMLElement | null | undefined>) => {
    const fakeDocumentRef = { current: (document as any) as HTMLElement };

    return useEventListener(fakeDocumentRef, 'keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
            return;
        }

        const focusablesList = [
            ...(ref.current?.querySelectorAll(
                "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable]"
            ) || []),
        ] as HTMLElement[];

        if (!focusablesList.length) {
            return;
        }

        const currentItem = event.target as HTMLElement;
        const firstItem = focusablesList[0];
        const lastItem = focusablesList[focusablesList.length - 1];

        // Outside focus trap container: focus on first
        if (focusablesList.indexOf(currentItem) === -1) {
            event.preventDefault();
            return firstItem.focus();
        }

        if (event.shiftKey && currentItem === firstItem) {
            event.preventDefault();
            return lastItem.focus();
        }

        if (!event.shiftKey && currentItem === lastItem) {
            event.preventDefault();
            return firstItem.focus();
        }
    });
};

export default useFocusTrap;
