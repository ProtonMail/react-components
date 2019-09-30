import React from 'react';
import { c } from 'ttag';
import {
    useMailSettings,
    useEventManager,
    useApiWithoutResult,
    SubTitle,
    Alert,
    ThemeCards,
    useModals,
    useNotifications
} from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';
import { getThemeIdentifier, stripThemeIdentifier } from 'proton-shared/lib/themes/helpers';
import { ALL_THEMES } from 'proton-shared/lib/themes/themes.js';

import CustomThemeModal from './CustomThemeModal.js';

const { DARK, LIGHT, BLUE, CUSTOM } = ALL_THEMES;
const availableThemes = [DARK, LIGHT, BLUE, CUSTOM];
const customIdentifier = CUSTOM.identifier;

const ThemesSection = () => {
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateTheme);
    const themeIdentifier = getThemeIdentifier(Theme);
    const customCSS = themeIdentifier === customIdentifier ? Theme : '';

    const themes = availableThemes.map((theme) => {
        const id = stripThemeIdentifier(theme.identifier);
        return { ...theme, label: c('Theme').t`${theme.label}`, id, alt: id };
    });

    const handleChangeTheme = async (themeIdentifier) => {
        if (themeIdentifier === customIdentifier) {
            return handleOpenModal();
        }
        await request(themeIdentifier);
        call();
    };

    const handleSaveCustomTheme = async (customCSSInput) => {
        await request(customCSSInput);
        call();
        close();
        createNotification({ text: c('Success').t`Custom theme saved` });
    };

    const handleOpenModal = () => {
        createModal(<CustomThemeModal theme={customCSS} onSave={handleSaveCustomTheme} />);
    };

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert>{c('Info').t`Choose the look and feel of your mailbox.`}</Alert>
            <Alert type="warning">{c('Info')
                .t`Selecting another theme will override your current theme and any customization will be lost.`}</Alert>
            <ThemeCards
                list={themes}
                themeIdentifier={themeIdentifier}
                onChange={handleChangeTheme}
                onCustomization={handleOpenModal}
                disabled={loading}
            />
        </>
    );
};

export default ThemesSection;
