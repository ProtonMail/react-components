import React, { useState } from 'react';
import { c } from 'ttag';
import {
    useMailSettings,
    useEventManager,
    useApiWithoutResult,
    SubTitle,
    Alert,
    ThemeCards,
    InputModal
} from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';
import { availableThemes } from './availableThemes.js';
import { getThemeIdentifier } from 'react-components/helpers/themes';
import { THEMES } from 'proton-shared/lib/constants';

const {
    CUSTOM: { identifier: customId }
} = THEMES;

const ThemesSection = () => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateTheme);

    const themeId = getThemeIdentifier(Theme);
    const customCSS = themeId === customId ? Theme : '';

    const handleChangeTheme = async (themeId) => {
        if (themeId === customId) {
            return openModal();
        }
        await request(themeId);
        call();
    };
    const handleSubmit = async (customCSSInput) => {
        closeModal();
        await request(customCSSInput);
        call();
    };

    const themeText = c('Info')
        .t`ProtonMail offers 3 default themes to select from. You can also import a custom theme using our CSS editor`;
    const customizationThemeText = c('Info')
        .t`Selecting another theme will override your current theme and any customization will be lost`;
    const customThemeText = c('Info')
        .t`Custom themes from third parties can potentially betray your privacy. Only use themes from trusted sources`;

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert>{themeText}</Alert>
            <Alert type="warning">{customizationThemeText}</Alert>
            <br />
            <ThemeCards
                list={availableThemes}
                themeId={themeId}
                onChange={handleChangeTheme}
                onCustomization={openModal}
                disabled={loading}
            />
            {showModal ? (
                <InputModal
                    type="textarea"
                    title={c('Title').t`Custom Theme`}
                    subtitle={<Alert>{customThemeText}</Alert>}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    submit={c('Action').t`Save`}
                    input={customCSS}
                    placeholder={c('Action').t`Insert CSS code here`}
                />
            ) : null}
        </>
    );
};

export default ThemesSection;
