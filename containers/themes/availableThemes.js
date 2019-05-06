import { c } from 'ttag';
import { THEMES } from 'proton-shared/lib/constants';
import themeDarkSvg from 'design-system/assets/img/pm-images/theme-dark.svg';
import themeLightSvg from 'design-system/assets/img/pm-images/theme-light.svg';
import themeBlueSvg from 'design-system/assets/img/pm-images/theme-blue.svg';
import themeTestSvg from 'design-system/assets/img/pm-images/theme-test.svg';
import { stripThemeIdentifier } from 'react-components';

const themeDark = {
    label: c('Theme label').t`${THEMES.DARK.label}`,
    id: THEMES.DARK.identifier,
    alt: stripThemeIdentifier(THEMES.DARK.identifier),
    src: themeDarkSvg,
    customizable: false
};

const themeLight = {
    label: c('Theme label').t`${THEMES.LIGHT.label}`,
    id: THEMES.LIGHT.identifier,
    alt: stripThemeIdentifier(THEMES.LIGHT.identifier),
    src: themeLightSvg,
    customizable: false
};

const themeBlue = {
    label: c('Theme label').t`${THEMES.BLUE.label}`,
    id: THEMES.BLUE.identifier,
    alt: stripThemeIdentifier(THEMES.BLUE.identifier),
    src: themeBlueSvg,
    customizable: false
};

const themeCustom = {
    label: c('Theme label').t`${THEMES.CUSTOM.label}`,
    id: THEMES.CUSTOM.identifier,
    alt: stripThemeIdentifier(THEMES.CUSTOM.identifier),
    src: themeTestSvg,
    customizable: true
};

export const availableThemes = [themeDark, themeLight, themeBlue, themeCustom];
