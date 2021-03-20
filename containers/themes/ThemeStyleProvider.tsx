import React, { createContext, useContext, useState } from 'react';
import { PROTON_THEMES } from 'proton-shared/lib/themes/themes';
import { noop } from 'proton-shared/lib/helpers/function';

export const Context = createContext([noop, PROTON_THEMES.DEFAULT.theme]);

interface Props {
    children: React.ReactNode;
}

export const useThemeStyle = () => {
    return useContext(Context);
};

const ThemeStyleProvider = ({ children }: Props) => {
    const state = useState<string>(() => PROTON_THEMES.DEFAULT.theme);
    return (
        <Context.Provider value={state}>
            <style id="theme">{state[0]}</style>
            {children}
        </Context.Provider>
    );
};

export default ThemeStyleProvider;
