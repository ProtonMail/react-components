import React, { useState, useEffect, useLayoutEffect } from 'react';
import { getThemeIdentifier, getTheme, toStyle, isDarkTheme } from 'proton-shared/lib/themes/helpers';
import { PROTON_THEMES } from 'proton-shared/lib/themes/themes';
import { DARK_MODE_CLASS } from 'proton-shared/lib/constants';
import { useUserSettings, useOrganization } from '../../hooks';

const getStyle = (userTheme: string, orgTheme: string) => {
    const themeIdentifier = getThemeIdentifier(userTheme);
    if (themeIdentifier === PROTON_THEMES.DEFAULT.identifier) {
        return orgTheme;
    }
    const themeValue = getTheme(themeIdentifier);
    if (themeValue) {
        return toStyle([themeValue, orgTheme]);
    }
    return toStyle([userTheme, orgTheme]);
};

const ThemeInjector = () => {
    const [{ Theme: userTheme = '' } = {}] = useUserSettings();
    const [{ Theme: orgTheme = '' } = {}] = useOrganization();
    const [style, setStyle] = useState(() => getStyle(userTheme, orgTheme));

    useEffect(() => {
        setStyle(getStyle(userTheme, orgTheme));
    }, [userTheme, orgTheme]);

    useLayoutEffect(() => {
        if (isDarkTheme(userTheme)) {
            document.body.classList.add(DARK_MODE_CLASS);
        } else {
            document.body.classList.remove(DARK_MODE_CLASS);
        }
        return () => {
            document.body.classList.remove(DARK_MODE_CLASS);
        };
    }, [userTheme]);

    return <style>{style}</style>;
};

export default ThemeInjector;
