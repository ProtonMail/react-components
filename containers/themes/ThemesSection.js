import React from 'react';
import { c } from 'ttag';
import {
    useMailSettings,
    useEventManager,
    useApiWithoutResult,
    SubTitle,
    Alert,
    ThemeCards,
    InputModal,
    useModal,
    getThemeIdentifier
} from 'react-components';
import { updateTheme } from 'proton-shared/lib/api/mailSettings';
import { availableThemes } from './availableThemes.js';
import { THEMES } from 'proton-shared/lib/constants';

const {
    CUSTOM: { identifier: customId }
} = THEMES;

const ThemesSection = () => {
    const { isOpen: showCustomModal, open: openCustomModal, close: closeCustomModal } = useModal();

    const [{ Theme }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateTheme);

    const themeId = getThemeIdentifier(Theme);
    const customCSS = themeId === customId ? Theme : '';

    const handleChangeTheme = async (themeId) => {
        if (themeId === customId) {
            openCustomModal();
            return;
        }
        await request(themeId);
        call();
    };
    const handleSubmit = async (customCSSInput) => {
        closeCustomModal();
        await request(customCSSInput);
        call();
    };

    const themeText = c('Info')
        .t`ProtonMail offers 3 default themes to select from. You can also import a custom theme using our CSS editor`;
    const customizationThemeText = c('Info')
        .t`Selecting another theme will override your current theme and any customization will be lost`;
    // const customThemeText = c('Info')
    //     .t`Custom themes from third parties can potentially betray your privacy. Only use themes from trusted sources`;

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert>{themeText}</Alert>
            <Alert type="warning">{customizationThemeText}</Alert>
            <br />
            <ThemeCards
                list={availableThemes}
                themeId={themeId}
                onChange={handleChangeTheme}
                onCustomization={openCustomModal}
                disabled={loading}
            />
            <InputModal
                isTextArea={true}
                title={c('Title').t`Custom Theme`}
                show={showCustomModal}
                onSubmit={handleSubmit}
                onClose={closeCustomModal}
                submit={c('Action').t`Save`}
                input={customCSS}
                placeholder={c('Action').t`Insert CSS code here`}
            >
                {/* <Alert>{customThemeText}</Alert> */}
            </InputModal>
        </>
    );
};

export default ThemesSection;

// All the code below will disappear when the themes are finally produced

// const CSSLightTheme =
//     '/* light-theme */.aside {\r\n  background: #116ee0; }\r\n\r\n.logo g {\r\n  fill: #f6f7fa; }\r\n\r\n.toolbar {\r\n  background: #788ee8; }\r\n\r\n.content {\r\n  background-image: -webkit-linear-gradient(top, #526ee0, #788ee8);\r\n  background-image: linear-gradient(to bottom, #526ee0, #788ee8); }\r\n\r\n.navigation__link,\r\n.navigation__link:focus,\r\n.navigation__link:hover,\r\n.animated-expandmore__button {\r\n  color: #e3e4e7; }\r\n\r\n[aria-expanded="true"].animated-expandmore__button,\r\n[aria-current="page"].navigation__link,\r\n.animated-expandmore__button:active {\r\n  background: #526ee0;\r\n  color: #fff; }\r\n\r\n.has-scroll-inside-navigation > .spacebar-container::before {\r\n  background: linear-gradient(to top, #526ee0 0, rgba(0, 0, 0, 0) 2em); }\r\n\r\n.aside-link {\r\n  background: rgba(0, 0, 0, .3); }\r\n\r\n.searchbox-field[type="search"] {\r\n  background-color: rgba(0, 0, 0, .2);\r\n  border-color: #526ee0; }\r\n\r\n.spacebar {\r\n  background: rgba(255, 255, 255, .1); }\r\n\r\n.spacebar::-webkit-meter-bar {\r\n  background: rgba(255, 255, 255, .1); }\r\n\r\n.topnav-link {\r\n  color: #fff; }\r\n  .topnav-link:focus, .topnav-link:hover, .topnav-link:active, .topnav-link[aria-current="true"] {\r\n    color: #fff; }\r\n    .topnav-link:focus > .topnav-icon, .topnav-link:hover > .topnav-icon, .topnav-link:active > .topnav-icon, .topnav-link[aria-current="true"] > .topnav-icon {\r\n      fill: #fff; }\r\n  .topnav-link[aria-current="true"] {\r\n    border-color: #fff; }\r\n\r\n.searchbox-advanced-search-button svg,\r\n.topnav-link svg {\r\n  fill: #fff; }\r\n\r\n.main {\r\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1); }';
// const CSSBlueTheme =
//     '/* blue-theme */.aside {\r\n  background: #526ee0; }\r\n\r\n.logo g {\r\n  fill: #f6f7fa; }\r\n\r\n.toolbar {\r\n  background: #788ee8; }\r\n\r\n.content {\r\n  background-image: -webkit-linear-gradient(top, #526ee0, #788ee8);\r\n  background-image: linear-gradient(to bottom, #526ee0, #788ee8); }\r\n\r\n.navigation__link,\r\n.navigation__link:focus,\r\n.navigation__link:hover,\r\n.animated-expandmore__button {\r\n  color: #e3e4e7; }\r\n\r\n[aria-expanded="true"].animated-expandmore__button,\r\n[aria-current="page"].navigation__link,\r\n.animated-expandmore__button:active {\r\n  background: #526ee0;\r\n  color: #fff; }\r\n\r\n.has-scroll-inside-navigation > .spacebar-container::before {\r\n  background: linear-gradient(to top, #526ee0 0, rgba(0, 0, 0, 0) 2em); }\r\n\r\n.aside-link {\r\n  background: rgba(0, 0, 0, .3); }\r\n\r\n.searchbox-field[type="search"] {\r\n  background-color: rgba(0, 0, 0, .2);\r\n  border-color: #526ee0; }\r\n\r\n.spacebar {\r\n  background: rgba(255, 255, 255, .1); }\r\n\r\n.spacebar::-webkit-meter-bar {\r\n  background: rgba(255, 255, 255, .1); }\r\n\r\n.topnav-link {\r\n  color: #fff; }\r\n  .topnav-link:focus, .topnav-link:hover, .topnav-link:active, .topnav-link[aria-current="true"] {\r\n    color: #fff; }\r\n    .topnav-link:focus > .topnav-icon, .topnav-link:hover > .topnav-icon, .topnav-link:active > .topnav-icon, .topnav-link[aria-current="true"] > .topnav-icon {\r\n      fill: #fff; }\r\n  .topnav-link[aria-current="true"] {\r\n    border-color: #fff; }\r\n\r\n.searchbox-advanced-search-button svg,\r\n.topnav-link svg {\r\n  fill: #fff; }\r\n\r\n.main {\r\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1); }';

// const CSSLightTheme = '/* light-theme */';
// const CSSBlueTheme = '/* blue-theme */';
// const getCSS = (themeName) => {
//     switch (themeName) {
//         case 'light-theme':
//             return CSSLightTheme;
//         case 'blue-theme':
//             return CSSBlueTheme;
//         default:
//             return '';
//     }
// };
