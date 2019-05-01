import { THEMES } from 'proton-shared/lib/constants';
import themeDarkSvg from 'design-system/assets/img/pm-images/theme-dark.svg';
import themeLightSvg from 'design-system/assets/img/pm-images/theme-light.svg';
import themeBlueSvg from 'design-system/assets/img/pm-images/theme-blue.svg';
import themeTestSvg from 'design-system/assets/img/pm-images/theme-test.svg';

const { DARK: darkAttributes, LIGHT: lightAttributes, BLUE: blueAttributes, CUSTOM: customAttributes } = THEMES;

export const themeDark = {
    ...darkAttributes,
    src: themeDarkSvg,
    customizable: false
};

export const themeLight = {
    ...lightAttributes,
    src: themeLightSvg,
    customizable: false
};

export const themeBlue = {
    ...blueAttributes,
    src: themeBlueSvg,
    customizable: false
};

export const themeCustom = {
    ...customAttributes,
    src: themeTestSvg,
    customizable: true
};
