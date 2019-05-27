import React, { createContext, useContext, useReducer } from 'react';
import { useUserSettings } from 'react-components';
import { DEFAULT_TRANSLATION } from 'proton-shared/lib/constants';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const [userSettings = { Locale: DEFAULT_TRANSLATION }] = useUserSettings();
    const initialState = {
        locale: userSettings.Locale
    };
    const reducer = (state, action) => {
        if (action.type === 'setLocale') {
            return { ...state, locale: action.locale };
        }
        return state;
    };

    return <LocaleContext.Provider value={useReducer(reducer, initialState)}>{children}</LocaleContext.Provider>;
};
export const useLocale = () => useContext(LocaleContext);
