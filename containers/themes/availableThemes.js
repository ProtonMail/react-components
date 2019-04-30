import themeDarkSvg from 'design-system/assets/img/pm-images/theme-dark.svg';
import themeLightSvg from 'design-system/assets/img/pm-images/theme-light.svg';
import themeBlueSvg from 'design-system/assets/img/pm-images/theme-blue.svg';
import themeTestSvg from 'design-system/assets/img/pm-images/theme-test.svg';

export const themeDark = {
    label: 'Dark (Default)',
    id: 'dark',
    value: 'dark-theme',
    alt: 'theme-dark',
    src: themeDarkSvg
};

export const themeLight = {
    label: 'Light',
    id: 'light',
    value: 'light-theme',
    alt: 'theme-light',
    src: themeLightSvg
};

export const themeBlue = {
    label: 'Blue',
    id: 'blue',
    value: 'blue-theme',
    alt: 'theme-blue',
    src: themeBlueSvg
};

export const themeCustom = {
    label: 'Custom theme',
    id: 'custom',
    value: 'custom-theme',
    alt: 'theme-custom',
    src: themeTestSvg
};
