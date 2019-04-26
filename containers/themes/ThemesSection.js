import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { useMailSettings, useEventManager, useApiWithoutResult, SubTitle, Alert, ThemeCards } from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';
import { themeDark, themeLight, themeBlue, themeCustom } from './availableThemes.js';

const availableThemes = [themeDark, themeLight, themeBlue, themeCustom];

const ThemesSection = () => {
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

    const themeText =
        'ProtonMail offers 3 default themes to select from. You can also import a custom theme using our CSS editor';
    const customThemeText =
        'Selecting another theme will override your current theme and any customization will be lost';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert>{c('Info').t`${themeText}`}</Alert>
            <Alert type="warning">{c('Info').t`${customThemeText}`}</Alert>
            <br />
            <ThemeCards list={availableThemes} themeMode={themeMode} onChange={handleChangeTheme} disabled={loading} />
        </>
    );
};

ThemesSection.propTypes = {
    themeMode: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ThemesSection;
