import React, { useState, useEffect } from 'react';
import { useMailSettings, useOrganization } from 'react-components';
import { getThemeIdentifier, getTheme, toStyle } from 'proton-shared/lib/themes/helpers';
import { PROTON_THEMES, DEFAULT_THEME } from 'proton-shared/lib/themes/themes';

const protonThemeIds = Object.values(PROTON_THEMES).map(({ identifier }) => identifier);

const ThemeInjector = () => {
    const [{ Theme: userTheme = '' } = {}] = useMailSettings();
    const [{ Theme: orgTheme = '' } = {}] = useOrganization();
    const themeId = getThemeIdentifier(userTheme);
    const [style, setStyle] = useState('');

    useEffect(() => {
        if (themeId === DEFAULT_THEME.identifier) {
            return setStyle(orgTheme);
        }
        if (protonThemeIds.includes(themeId)) {
            return setStyle(toStyle([getTheme(themeId), orgTheme]));
        }

        setStyle(toStyle([userTheme, orgTheme]));
    }, [userTheme, orgTheme]);

    return <style>{style}</style>;
};

export default ThemeInjector;
