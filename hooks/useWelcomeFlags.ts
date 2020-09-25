import { UserSettingsModel } from 'proton-shared/lib/models/userSettingsModel';
import { useCallback, useState } from 'react';
import useCache from './useCache';

export const WELCOME_FLAG_KEY = 'flow';

export interface WelcomeFlagsState {
    isSignupFlow?: boolean;
    isWelcomeFlow?: boolean;
    isWelcomeFlag?: boolean;
}

const useWelcomeFlags = (): [WelcomeFlagsState, () => void] => {
    const cache = useCache();
    const [state, setState] = useState<WelcomeFlagsState>(() => {
        // Set from ProtonApp
        const flow = cache.get(WELCOME_FLAG_KEY);
        const isSignupFlow = flow === 'signup';
        // Assumes that user settings has been pre-loaded. Not using hook to avoid re-renders.
        const isWelcomeFlag = cache.get(UserSettingsModel.key)?.value?.WelcomeFlag === 0;
        return {
            isSignupFlow,
            isWelcomeFlag,
            isWelcomeFlow: isSignupFlow || isWelcomeFlag,
        }
    });
    const setDone = useCallback(() => {
        setState({});
    }, []);
    return [state, setDone];
}

export default useWelcomeFlags;
