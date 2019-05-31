import { c } from 'ttag';
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUserSettings, useConfig, useNotifications } from 'react-components';
import { DEFAULT_TRANSLATION } from 'proton-shared/lib/constants';
import { loadLocale } from 'proton-shared/lib/i18n';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const config = useConfig();
    const { createNotification } = useNotifications();
    const [{ Locale = DEFAULT_TRANSLATION } = { Locale }] = useUserSettings();
    const [state, setState] = useState(Locale);

    // Load the translations when we load the app
    useEffect(() => {
        loadLocale(config, Locale).then(() => {
            setState(Locale); // force refresh children
        });
    }, []);

    useEffect(() => {
        // Only when the locale changes via event
        if (state !== Locale) {
            loadLocale(config, Locale).then(() => {
                setState(Locale); // force refresh children
                createNotification({ text: c('Success').t`Locale updated` });
            });
        }
    });

    return <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>;
};

LocaleProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useLocale = () => useContext(LocaleContext);
