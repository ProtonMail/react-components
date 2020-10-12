import { useEffect } from 'react';
import { useMailSettings } from './useMailSettings';

const useHotkeys = (callback: (e: KeyboardEvent) => void) => {
    const [{ Hotkeys } = { Hotkeys: 0 }] = useMailSettings();

    useEffect(() => {
        if (Hotkeys) {
            document.addEventListener('keydown', callback);
        }

        return () => {
            if (Hotkeys) {
                document.removeEventListener('keydown', callback);
            }
        };
    }, [Hotkeys]);

    return null;
};

export default useHotkeys;
