import {
    DARK_THEME_LABEL,
    DARK_THEME_VALUE,
    LIGHT_THEME_LABEL,
    LIGHT_THEME_VALUE,
    BLUE_THEME_LABEL,
    BLUE_THEME_VALUE,
    CUSTOM_THEME_LABEL,
    CUSTOM_THEME_VALUE
} from 'proton-shared/lib/constants';
import themeDarkSvg from 'design-system/assets/img/pm-images/theme-dark.svg';
import themeLightSvg from 'design-system/assets/img/pm-images/theme-light.svg';
import themeBlueSvg from 'design-system/assets/img/pm-images/theme-blue.svg';
import themeTestSvg from 'design-system/assets/img/pm-images/theme-test.svg';

const themeDark = {
    label: DARK_THEME_LABEL,
    id: DARK_THEME_VALUE,
    value: DARK_THEME_VALUE,
    alt: DARK_THEME_VALUE,
    src: themeDarkSvg,
    customizable: false
};

const themeLight = {
    label: LIGHT_THEME_LABEL,
    id: LIGHT_THEME_VALUE,
    value: LIGHT_THEME_VALUE,
    alt: LIGHT_THEME_VALUE,
    src: themeLightSvg,
    customizable: false
};

const themeBlue = {
    label: BLUE_THEME_LABEL,
    id: BLUE_THEME_VALUE,
    value: BLUE_THEME_VALUE,
    alt: BLUE_THEME_VALUE,
    src: themeBlueSvg,
    customizable: false
};

const themeCustom = {
    label: CUSTOM_THEME_LABEL,
    id: CUSTOM_THEME_VALUE,
    value: CUSTOM_THEME_VALUE,
    alt: CUSTOM_THEME_VALUE,
    src: themeTestSvg,
    customizable: true
};

const availableThemes = [themeDark, themeLight, themeBlue, themeCustom];

export default availableThemes;
