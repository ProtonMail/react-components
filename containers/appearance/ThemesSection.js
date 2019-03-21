import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert } from 'react-components';
import { DisplayThemes } from './DisplayThemes';
import { themeDark, themeLight, themeBlue, themeCompany, themeTest } from './availableThemes.js';

const availableThemes = [themeDark, themeLight, themeBlue, themeCompany, themeTest];

const ThemesSection = () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="todo">{c('Info').t`${dummyText}`}</Alert>
            <br />
            <DisplayThemes list={availableThemes} />
        </>
    );
};

export default ThemesSection;
