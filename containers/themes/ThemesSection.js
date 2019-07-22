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
import { getThemeIdentifier } from 'react-components/helpers/themes';
import { THEMES } from 'proton-shared/lib/constants';

import { availableThemes } from './availableThemes.js';
import CustomThemeModal from './CustomThemeModal.js';

const {
    CUSTOM: { identifier: customId }
} = THEMES;

const ThemesSection = () => {
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateTheme);
    const themeId = getThemeIdentifier(Theme);
    const customCSS = themeId === customId ? Theme : '';

    const handleChangeTheme = async (themeId) => {
        if (themeId === customId) {
            return handleOpenModal();
        }
        await request(themeId);
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
                list={availableThemes}
                themeId={themeId}
                onChange={handleChangeTheme}
                onCustomization={handleOpenModal}
                disabled={loading}
            />
        </>
    );
};

export default ThemesSection;
