import React, { ChangeEvent } from 'react';
import { c } from 'ttag';

import { Select } from 'react-components';
import { PACKAGE_TYPE, PGP_SCHEMES } from 'proton-shared/lib/constants';
import { PGP_SCHEME_TEXT } from 'proton-shared/lib/contacts/constants';
import { MailSettings } from 'proton-shared/lib/interfaces';

const { INLINE, MIME } = PGP_SCHEME_TEXT;

const { PGP_MIME, PGP_INLINE } = PGP_SCHEMES;

interface Props {
    value: string;
    mailSettings: MailSettings;
    onChange: (value: PGP_SCHEMES | string) => void;
}

const ContactSchemeSelect = ({ value, mailSettings, onChange }: Props) => {
    const { PGPScheme } = mailSettings;
    const defaultValueText = PGPScheme === PACKAGE_TYPE.SEND_PGP_INLINE ? INLINE : MIME;

    const options = [
        { value: '', text: c('Default encryption scheme').t`Use global default (${defaultValueText})` },
        { value: PGP_MIME, text: MIME },
        { value: PGP_INLINE, text: INLINE }
    ];

    const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => onChange(target.value);

    return <Select options={options} value={value} onChange={handleChange} />;
};

export default ContactSchemeSelect;
