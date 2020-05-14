import React, { useState, ChangeEvent } from 'react';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { getBrowserLocale, getClosestMatches } from 'proton-shared/lib/i18n/helper';
import { Select, useForceRefresh, useConfig } from 'react-components';
import { Locales } from 'proton-shared/lib/interfaces/Locales';

interface Props {
    locales: Locales;
    className?: string;
}

const LanguageSelect = ({ locales, className }: Props) => {
    const [language] = useState(getBrowserLocale());
    const forceRefresh = useForceRefresh();
    const { LOCALES = {} } = useConfig();
    const options = Object.keys(LOCALES).map((value) => ({
        text: LOCALES[value],
        value
    }));
    const handleChange = async ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const newLocale = target.value;
        await loadLocale({
            ...getClosestMatches({
                locale: newLocale,
                browserLocale: getBrowserLocale(),
                locales
            }),
            locales
        });
        forceRefresh();
    };

    return <Select options={options} value={language} onChange={handleChange} className={className} />;
};

export default LanguageSelect;
