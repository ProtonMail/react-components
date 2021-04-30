import React from 'react';
import { c } from 'ttag';
import { PROTON_THEMES, ThemeTypes } from 'proton-shared/lib/themes/themes';
import { updateThemeType } from 'proton-shared/lib/api/settings';

import { FormModal } from '../../components';
import { useApi } from '../../hooks';
import { ThemeCards, useTheme } from '.';
import useSynchronizingState from '../../hooks/useSynchronizingState';

const availableThemes = Object.values(PROTON_THEMES);

const ThemesModal = (props: any) => {
    const api = useApi();
    const [theme, setTheme] = useTheme();
    const [localTheme, setLocalTheme] = useSynchronizingState(theme);

    const handleThemeChange = (newThemeType: ThemeTypes) => {
        setLocalTheme(newThemeType);
    };

    const handleSubmit = async () => {
        setTheme(localTheme);
        api(updateThemeType(localTheme));
    };

    const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
        return { identifier, label: getI18NLabel(), src };
    });

    return (
        <FormModal
            {...props}
            intermediate
            close={c('Action').t`Close`}
            submit={c('Action').t`Apply`}
            onSubmit={handleSubmit}
        >
            <div className="h2 text-center mb0-5">{c('Title').t`Select a theme`}</div>
            <p className="text-center mt0 mb2">{c('Info').t`You can change this anytime in your settings.`}</p>
            <div className="flex">
                <ThemeCards liClassName="w33" list={themes} themeIdentifier={localTheme} onChange={handleThemeChange} />
            </div>
        </FormModal>
    );
};

export default ThemesModal;
