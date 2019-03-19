import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert, ThemeCard } from 'react-components';

const themeDark = {
    label: 'Dark (Default)',
    id: 'dark',
    value: 'todo',
    alt: 'theme-dark',
    src: 'assets/img/theme-dark.svg',
    previewURL: 'todo'
};

const themeLight = {
    label: 'Light ',
    id: 'light',
    value: 'todo',
    alt: 'theme-light',
    src: 'assets/img/theme-light.svg',
    previewURL: 'todo'
};

const ThemesSection = () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="someURL">{c('Info').t`${dummyText}`}</Alert>
            <ThemeCard checked={true} theme={themeDark} />
            <ThemeCard checked={true} theme={themeLight} />
        </>
    );
};

export default ThemesSection;
