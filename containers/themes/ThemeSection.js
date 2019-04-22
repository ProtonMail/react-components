import React from 'react';
import { useMailSettings, useEventManager, useApiWithoutResult } from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';

// TODO: Preferred way of importing: locally or from react-components?
import ThemesSection from './ThemesSection';
import ThemesEditorSection from './ThemeEditorSection';
import CustomThemeSection from './CustomThemeSection';

const ThemeSection = () => {
    // eslint-disable-next-line no-unused-vars
    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();

    const { request, loading } = useApiWithoutResult(updateTheme);

    const handleChangeTheme = async (theme) => {
        await request(theme);
        call();
    };

    // TODO
    const themeMode = 0;

    return (
        <>
            <ThemesSection themeMode={themeMode} onChange={handleChangeTheme} loading={loading} />
            <ThemesEditorSection themeMode={themeMode} onChange={handleChangeTheme} loading={loading} />
            <CustomThemeSection />
        </>
    );
};

export default ThemeSection;
