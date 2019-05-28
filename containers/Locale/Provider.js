import React, { createContext, useContext, useState } from 'react';
import { useUserSettings, useConfig } from 'react-components';
import { DEFAULT_TRANSLATION } from 'proton-shared/lib/constants';
import { loadLocale } from 'proton-shared/lib/i18n';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const [state, setState] = useState(DEFAULT_TRANSLATION);
    const config = useConfig();
    const [{ Locale = DEFAULT_TRANSLATION } = { Locale }] = useUserSettings();

    if (state !== Locale) {
        console.log('LOAD', state);
        loadLocale(config, Locale).then(() => {
            console.log('Set State', { Locale, config, state });
            setState(Locale);
        });
    }

    console.log('LOAD LOCALE', { Locale, config, state });

    // const initialState = {
    //     locale: userSettings.Locale
    // };

    // const reducer = (state, action) => {
    //     if (action.type === 'setLocale') {
    //         return { ...state, locale: action.locale };
    //     }
    //     return state;
    // };

    return <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>;
};
export const useLocale = () => useContext(LocaleContext);
