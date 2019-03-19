import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert, ThemeCard } from 'react-components';

const themeDark = {
    label: 'Dark (Default)',
    id: 'dark',
    value: 'todo',
    alt: 'theme-dark',
    src: 'design-system/assets/img/pm-images/theme-dark.svg',
    previewURL: 'todo'
};

// const lightTheme = {
//     name: 'Light',
//     colorLeft: '#eeeff1',
//     colorBig: '#f6f7fa',
//     colorSmall: '#ffffff'
// };

// const blueTheme = {
//     name: 'Blue',
//     colorLeft: '#526ee0',
//     colorBig: '#788ee8',
//     colorSmall: '#ffffff'
// };

// const companyTheme = {
//     name: 'Company (Editor)',
//     colorLeft: '#1b8a8e',
//     colorBig: '#1ad5a3',
//     colorSmall: '#ffffff'
// };

// const customTheme = {
//     name: 'Test (Custom)',
//     colorLeft: '#8e1b7b',
//     colorBig: '#d51a71',
//     colorSmall: '#ffffff'
// };

const ThemesSection = () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="someURL">{c('Info').t`${dummyText}`}</Alert>
            <ThemeCard checked="true" theme={themeDark} />
        </>
    );
};

export default ThemesSection;
