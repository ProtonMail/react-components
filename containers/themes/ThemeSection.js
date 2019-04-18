import React from 'react';
// import { c } from 'ttag';
import { useMailSettings, useEventManager, useApiWithoutResult } from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';

import ThemesSection from './ThemesSection';

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
        </>
    );
};

export default ThemeSection;
