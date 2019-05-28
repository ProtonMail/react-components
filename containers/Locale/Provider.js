import { c } from 'ttag';
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserSettings, useConfig, useNotifications } from 'react-components';
import { DEFAULT_TRANSLATION } from 'proton-shared/lib/constants';
import { loadLocale } from 'proton-shared/lib/i18n';

export const LocaleContext = createContext();

const appState = {};
export const LocaleProvider = ({ children }) => {
    const config = useConfig();
    const { createNotification } = useNotifications();
    const [{ Locale = DEFAULT_TRANSLATION } = { Locale }] = useUserSettings();
    const [state, setState] = useState(Locale);

    // Only when the locale changes via event or onLoadApp
    if (state !== Locale || !appState.isLoaded) {
        appState.isLoaded = true;

        loadLocale(config, Locale).then(() => {
            appState.isTranslated && createNotification({ text: c('Success').t`Locale updated` });
            setState(Locale); // force refresh children
            appState.isTranslated = true;
        });
    }

    return <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>;
};

LocaleProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useLocale = () => useContext(LocaleContext);
