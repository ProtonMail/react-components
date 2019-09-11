import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Row,
    Field,
    Label,
    Select,
    useApi,
    useLoading,
    useNotifications,
    useEventManager,
    useLocaleLoader,
    useUserSettings
} from 'react-components';
import { updateLocale } from 'proton-shared/lib/api/settings';

const LOCALES = {
    cs_CZ: 'Čeština',
    de_DE: 'Deutsch',
    en_US: 'English',
    es_ES: 'Español',
    ca_ES: 'Español - català',
    fr_FR: 'Français',
    hr_HR: 'Hrvatski',
    it_IT: 'Italiano',
    ja_JP: '日本語',
    nl_NL: 'Nederlands',
    pl_PL: 'Polski',
    pt_BR: 'Português, brasileiro',
    ru_RU: 'Pусский',
    ro_RO: 'Română',
    tr_TR: 'Türkçe',
    uk_UA: 'Українська',
    zh_CN: '简体中文',
    zh_TW: '繁體中'
};

const LanguageSection = () => {
    const loadLocale = useLocaleLoader();
    const [{ Locale }] = useUserSettings();
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();

    const options = Object.keys(LOCALES).map((value) => ({
        text: LOCALES[value],
        value
    }));

    const handleChange = async ({ target }) => {
        const newLocale = target.value;
        await api(updateLocale(newLocale));
        await loadLocale(newLocale);
        await call();
        createNotification({ text: c('Success').t`Locale updated` });
    };

    return (
        <>
            <SubTitle>{c('Title').t`Language`}</SubTitle>
            <Row>
                <Label htmlFor="languageSelect">{c('Label').t`Default language`}</Label>
                <Field>
                    <Select
                        disabled={loading}
                        value={Locale}
                        id="languageSelect"
                        options={options}
                        onChange={(e) => {
                            withLoading(handleChange(e));
                        }}
                    />
                </Field>
            </Row>
        </>
    );
};

export default LanguageSection;
