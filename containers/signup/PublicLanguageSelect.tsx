import React, { ChangeEvent } from 'react';
import { localeCode } from 'proton-shared/lib/i18n';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { getBrowserLocale, getClosestMatches } from 'proton-shared/lib/i18n/helper';
import { Select, useForceRefresh, useConfig } from '../../index';

interface Props {
    className?: string;
    locales?: { [key: string]: () => Promise<void> };
}

const PublicLanguageSelect = ({ className, locales = {} }: Props) => {
    const forceRefresh = useForceRefresh();
    const { LOCALES = {} } = useConfig();
    const options = Object.keys(LOCALES).map((value) => ({
        text: LOCALES[value],
        value
    }));
    const handleChange = async ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const newLocale = target.value;
        const matches = getClosestMatches({
            locale: newLocale,
            browserLocale: getBrowserLocale(),
            locales: locales
        });
        await loadLocale({
            ...matches,
            locales: locales
        });
        forceRefresh();
    };
    return <Select options={options} value={localeCode} onChange={handleChange} className={className} />;
};

export default PublicLanguageSelect;
