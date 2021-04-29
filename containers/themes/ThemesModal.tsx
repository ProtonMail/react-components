import React from 'react';
import { c } from 'ttag';
import { PROTON_THEMES, ThemeTypes } from 'proton-shared/lib/themes/themes';
import { updateThemeType } from 'proton-shared/lib/api/settings';

import { FormModal } from '../../components';
import { useApi, useUserSettings } from '../../hooks';
import { ThemeCards, useTheme } from '.';

const availableThemes = Object.values(PROTON_THEMES);

const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
    return { identifier, label: getI18NLabel(), src };
});

const ThemesModal = (props: any) => {
    const [{ ThemeType: userThemeType }] = useUserSettings();
    const [theme, setTheme] = useTheme();
    const api = useApi();

    const handleThemeChange = (newThemeType: ThemeTypes) => {
        setTheme(newThemeType);
        api(updateThemeType(newThemeType));
    };

    const computedTheme = theme || userThemeType;

    return (
        <FormModal {...props} close={c('Action').t`Close`} hasSubmit={false}>
            <div className="h2 text-center mb0-5">{c('Title').t`Select a theme`}</div>
            <p className="text-center mt0 mb2">{c('Info').t`You can change this anytime in your settings.`}</p>
            <ThemeCards liClassName="w33" list={themes} themeIdentifier={computedTheme} onChange={handleThemeChange} />
        </FormModal>
    );
};

export default ThemesModal;
