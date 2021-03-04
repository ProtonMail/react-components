import React from 'react';
import { c } from 'ttag';

import { updateThemeType } from 'proton-shared/lib/api/settings';
import { PROTON_THEMES, ThemeTypes } from 'proton-shared/lib/themes/themes';

import { useUserSettings, useEventManager, useApi, useLoading, useNotifications } from '../../hooks';
import { SettingsSectionWide, SettingsParagraph } from '../account';

import ThemeCards from './ThemeCards';

const availableThemes = [PROTON_THEMES.DEFAULT, PROTON_THEMES.DARK];

const ThemesSection = () => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const [{ ThemeType }] = useUserSettings();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();

    const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
        return { identifier, label: getI18NLabel(), src };
    });

    const handleChangeTheme = async (newThemeIdentifier: ThemeTypes) => {
        await api(updateThemeType(newThemeIdentifier));
        await call();
        createNotification({ text: c('Success').t`Theme saved` });
    };

    return (
        <SettingsSectionWide>
            <SettingsParagraph>{c('Info').t`Choose the look and feel of your Mailbox.`}</SettingsParagraph>
            <ThemeCards
                list={themes}
                themeIdentifier={ThemeType}
                onChange={(identifier) => withLoading(handleChangeTheme(identifier))}
                disabled={loading}
            />
        </SettingsSectionWide>
    );
};

export default ThemesSection;
