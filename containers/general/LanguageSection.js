import React, { useState } from 'react';
import { c, getConfig } from 'ttag';
import {
    SubTitle,
    Row,
    Field,
    Label,
    Select,
    useUserSettings,
    useApiWithoutResult,
    useNotifications,
    useConfig
} from 'react-components';
import { updateLocale } from 'proton-shared/lib/api/settings';
import { loadLocale } from 'proton-shared/lib/i18n';

function LanguageSection() {
    const [{ Locale }] = useUserSettings();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(updateLocale);
    const [locale, setLocale] = useState(Locale);
    const config = useConfig();

    const options = [
        { text: 'Čeština', value: 'cs_CZ' },
        { text: 'Deutsch', value: 'de_DE' },
        { text: 'English', value: 'en_US' },
        { text: 'Español', value: 'es_ES' },
        { text: 'Français', value: 'fr_FR' },
        // { text: 'Bahasa Indonesia', value: 'id_ID' },
        { text: 'Hrvatski', value: 'hr_HR' },
        { text: 'Italiano', value: 'it_IT' },
        { text: '日本語', value: 'ja_JP' },
        { text: 'Nederlands', value: 'nl_NL' },
        { text: 'Polski', value: 'pl_PL' },
        { text: 'Português, brasileiro', value: 'pt_BR' },
        { text: 'Pусский', value: 'ru_RU' },
        { text: 'Română', value: 'ro_RO' },
        { text: 'Türkçe', value: 'tr_TR' },
        { text: 'Українська', value: 'uk_UA' },
        { text: '简体中文', value: 'zh_CN' },
        { text: '繁體中文', value: 'zh_TW' }
    ];

    const handleChange = async ({ target }) => {
        const newLocale = target.value;
        await request(newLocale);
        await loadLocale(config, newLocale);
        setLocale(newLocale);
        console.log(getConfig);
        createNotification({ text: c('Success').t`Locale updated` });
    };
    console.log(getConfig);

    return (
        <div>
            <SubTitle>{c('Title').t`Language`}</SubTitle>
            <Row>
                <Label htmlFor="languageSelect">
                    {c('Label').t`Default language`} <kbd>{locale}</kbd>
                </Label>
                <Field>
                    <Select
                        disabled={loading}
                        value={locale}
                        id="languageSelect"
                        options={options}
                        onChange={handleChange}
                    />
                </Field>
            </Row>
        </div>
    );
}

export default LanguageSection;
