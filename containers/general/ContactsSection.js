import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Row,
    Field,
    Label,
    Toggle,
    Info,
    useToggle,
    useNotifications,
    useMailSettings,
    useEventManager,
    useApiWithoutResult
} from 'react-components';
import { updateAutoSaveContacts } from 'proton-shared/lib/api/mailSettings';

const ContactsSection = () => {
    const { createNotification } = useNotifications();
    const { call } = useEventManager();
    const [{ AutoSaveContacts } = {}] = useMailSettings();
    const { request, loading } = useApiWithoutResult(updateAutoSaveContacts);
    const { state, toggle } = useToggle(!!AutoSaveContacts);
    const handleChange = async ({ target }) => {
        await request(+target.checked);
        await call();
        toggle();
        createNotification({ text: c('Success').t`Preference saved` });
    };
    return (
        <>
            <SubTitle>{c('Title').t`Contacts`}</SubTitle>
            <Row>
                <Label htmlFor="saveContactToggle">
                    {c('Label').t`Automatically save contacts`}{' '}
                    <Info url="https://protonmail.com/support/knowledge-base/autosave-contact-list/" />
                </Label>
                <Field>
                    <Toggle id="saveContactToggle" disabled={loading} checked={state} onChange={handleChange} />
                </Field>
            </Row>
        </>
    );
};

export default ContactsSection;
