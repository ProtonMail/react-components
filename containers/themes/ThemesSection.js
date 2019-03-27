import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert, ThemeCards } from 'react-components';
import { themeDark, themeLight, themeBlue, themeCompany, themeTest } from './availableThemes.js';

const availableThemes = [themeDark, themeLight, themeBlue, themeCompany, themeTest];

const ThemesSection = () => {
    /*
    const [{ themeMode }] = useMailSettings();
    const { call } = useEventManager();

    const { request, loading } = useApiWithoutResult(updateThemeMode);
    const handleChangeThemeMode = async (mode) => {
        await requestThemeMode(mode);
        call();
    };
    */
    // waiting for the hooks
    const themeMode = 'dark';
    const handleChangeThemeMode = () => true;
    const loadingThemeMode = false;

    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="todo">{c('Info').t`${dummyText}`}</Alert>
            <br />
            <ThemeCards
                themeMode={themeMode}
                onChange={handleChangeThemeMode}
                loading={loadingThemeMode}
                list={availableThemes}
            />
        </>
    );
};

export default ThemesSection;
