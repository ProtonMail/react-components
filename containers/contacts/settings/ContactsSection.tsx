import React from 'react';
import { c } from 'ttag';

import { Row, Field, Label, Info } from '../../../components';
import { useMailSettings } from '../../../hooks';

import { AutoSaveContactsToggle } from '../../general';

const ContactsSection = () => {
    const [mailSettings] = useMailSettings();
    const { AutoSaveContacts } = mailSettings || {};
    return (
        <Row>
            <Label htmlFor="saveContactToggle">
                <span className="mr0-5">{c('Label').t`Automatically save contacts`}</span>
                <Info url="https://protonmail.com/support/knowledge-base/autosave-contact-list/" />
            </Label>
            <Field>
                <AutoSaveContactsToggle autoSaveContacts={!!AutoSaveContacts} id="saveContactToggle" />
            </Field>
        </Row>
    );
};

export default ContactsSection;
