import React from 'react';
import { c } from 'ttag';
import {
    useMailSettings,
    useEventManager,
    useApiWithoutResult,
    SubTitle,
    Alert,
    ThemeCards,
    InputModal,
    useModal
} from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';
import { availableThemes } from './availableThemes.js';
import { getThemeIdentifier } from 'react-components/helpers/themes';
import { THEMES } from 'proton-shared/lib/constants';

const {
    CUSTOM: { identifier: customId }
} = THEMES;

const ThemesSection = () => {
    const { isOpen, open, close } = useModal();

    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateTheme);

    const themeId = getThemeIdentifier(Theme);
    const customCSS = themeId === customId ? Theme : '';

    const handleChangeTheme = async (themeId) => {
        if (themeId === customId) {
            return open();
        }
        await request(themeId);
        call();
    };

    const handleSubmit = async (customCSSInput) => {
        close();
        await request(customCSSInput);
        call();
    };

    const themeText = c('Info')
        .t`ProtonMail offers 3 default themes to select from. You can also import a custom theme using our CSS editor`;
    const customizationThemeText = c('Info')
        .t`Selecting another theme will override your current theme and any customization will be lost`;
    const customWarningText = c('Warning')
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
                onCustomization={open}
                disabled={loading}
            />
            {isOpen ? (
                <InputModal
                    type="textarea"
                    title={c('Title').t`Custom Theme`}
                    warning={customWarningText}
                    onSubmit={handleSubmit}
                    onClose={close}
                    submit={c('Action').t`Save`}
                    input={customCSS}
                    placeholder={c('Action').t`Insert CSS code here`}
                />
            ) : null}
        </>
    );
};

export default ThemesSection;
