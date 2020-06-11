import React, { useState, ChangeEvent } from 'react';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { getBrowserLocale, getClosestMatches, getClosestMatch } from 'proton-shared/lib/i18n/helper';
import { Select, useForceRefresh, useConfig } from '../../index';

interface Props {
    className?: string;
}

const LanguageSelect = ({ className }: Props) => {
    const forceRefresh = useForceRefresh();
    const { LOCALES = {} } = useConfig();
    const [language] = useState(getClosestMatch(getBrowserLocale(), LOCALES));
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
                locales: LOCALES
            }),
            locales: LOCALES
        });
        forceRefresh();
    };

    return <Select options={options} value={language} onChange={handleChange} className={className} />;
};

export default LanguageSelect;
