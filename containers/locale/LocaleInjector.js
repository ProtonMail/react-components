import { useEffect } from 'react';
import { useUserSettings, useLocaleLoader } from 'react-components';

/**
 * The purpose of this component is to load the locale for a user
 * when it's been changed in another tab.
 */
export const LocaleInjector = () => {
    const [{ Locale } = {}] = useUserSettings();
    const loadLocale = useLocaleLoader();

    useEffect(() => {
        loadLocale(Locale);
    }, [Locale]);

    return null;
};

LocaleInjector.propTypes = {};

export default LocaleInjector;
