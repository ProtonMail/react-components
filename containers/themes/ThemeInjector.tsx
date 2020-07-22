import React, { useState, useEffect, useLayoutEffect } from 'react';
import { getThemeIdentifier, getTheme, toStyle, isDarkTheme } from 'proton-shared/lib/themes/helpers';
import { PROTON_THEMES, DEFAULT_THEME } from 'proton-shared/lib/themes/themes';
import { DARK_MODE_CLASS } from 'proton-shared/lib/constants';
import { useMailSettings, useOrganization } from '../../index';

const protonThemeIdentifiers = Object.values(PROTON_THEMES).map(({ identifier }) => identifier);

const getStyle = (userTheme: string, orgTheme: string) => {
    const themeIdentifier = getThemeIdentifier(userTheme);
    if (themeIdentifier === DEFAULT_THEME.identifier) {
        return orgTheme;
    }
    if (protonThemeIdentifiers.includes(themeIdentifier)) {
        return toStyle([getTheme(themeIdentifier), orgTheme]);
    }
    return toStyle([userTheme, orgTheme]);
};

const ThemeInjector = () => {
    const [{ Theme: userTheme = '' } = {}] = useMailSettings();
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
