import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { setLocales, languageCode, dateLocaleCode, localeCode } from 'proton-shared/lib/i18n/index';
import { getClosestMatch, getBrowserLocale, loadDateFnLocale, loadTtagLocale } from 'proton-shared/lib/i18n/helper';
import dateFnLocales from 'proton-shared/lib/i18n/dateFnLocales';
import { DEFAULT_LOCALE } from 'proton-shared/lib/constants';

import LocaleContext from './context';

const LocaleLoaderProvider = ({ children, locales, onRefresh }) => {
    const loadLocale = useCallback(async (locale) => {
        const newLocaleCode = getClosestMatch(locale, locales) || DEFAULT_LOCALE;
        const newDateLocaleCode = getClosestMatch(newLocaleCode, dateFnLocales) || DEFAULT_LOCALE;
        const browserDateLocaleCode = getClosestMatch(getBrowserLocale(), dateFnLocales) || dateLocaleCode;

        const mixedDateLocaleCode = `${newDateLocaleCode}-${browserDateLocaleCode}`;

        if (localeCode === newLocaleCode && dateLocaleCode === mixedDateLocaleCode) {
            return;
        }

        const languageCode = newLocaleCode.substr(0, 2);

        const [dateLocale] = await Promise.all([
            loadDateFnLocale({
                locale: dateLocaleCode,
                longLocale: browserDateLocaleCode,
                locales: dateFnLocales
            }),
            loadTtagLocale({
                locale: newLocaleCode,
                language: languageCode,
                locales
            })
        ]);

        setLocales({
            localeCode: newLocaleCode,
            languageCode,
            dateLocale,
            dateLocaleCode,
        });

        // Refresh the entire app when the locale changes.
        onRefresh();
    }, []);

    useEffect(() => {
        document.documentElement.lang = languageCode;
    }, [languageCode]);

    return <LocaleContext.Provider value={loadLocale}>{children}</LocaleContext.Provider>;
};

LocaleLoaderProvider.propTypes = {
    children: PropTypes.node.isRequired,
    locales: PropTypes.object,
    onRefresh: PropTypes.func.isRequired
};

export default LocaleLoaderProvider;
