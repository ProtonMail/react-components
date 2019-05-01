import {
    DARK_THEME_VALUE,
    LIGHT_THEME_VALUE,
    LIGHT_THEME_IDENTIFIER,
    BLUE_THEME_VALUE,
    BLUE_THEME_IDENTIFIER,
    CUSTOM_THEME_VALUE
} from 'proton-shared/lib/constants';

/**
 * Given a string with the CSS code for a theme, get theme name
 * @param {Theme} string		CSS code stringified
 * @return {string}             name of the theme corresponding to the CSS code
 */
export const getThemeName = (Theme) => {
    if (Theme) {
        if (Theme.startsWith(LIGHT_THEME_IDENTIFIER)) {
            return LIGHT_THEME_VALUE;
        }
        if (Theme.startsWith(BLUE_THEME_IDENTIFIER)) {
            return BLUE_THEME_VALUE;
        }
        return CUSTOM_THEME_VALUE;
    }
    return DARK_THEME_VALUE;
};
