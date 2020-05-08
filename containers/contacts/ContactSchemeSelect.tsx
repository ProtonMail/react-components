import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Select } from 'react-components';
import { PACKAGE_TYPE, PGP_SCHEMES } from 'proton-shared/lib/constants';
import { PGP_INLINE_TEXT, PGP_MIME_TEXT } from 'proton-shared/lib/contacts/constants';
import { MailSettings } from 'proton-shared/lib/interfaces';

const { PGP_MIME, PGP_INLINE } = PGP_SCHEMES;

interface Props {
    value: PropTypes.string;
    mailSettings: MailSettings;
    onChange: Function;
}

const ContactSchemeSelect = ({ value, mailSettings, onChange }: Props) => {
    const { PGPScheme } = mailSettings;
    const defaultValueText = PGPScheme === PACKAGE_TYPE.SEND_PGP_INLINE ? PGP_INLINE_TEXT : PGP_MIME_TEXT;

    const options = [
        { value: undefined, text: c('Default encryption scheme').t`Use global default (${defaultValueText})` },
        { value: PGP_MIME, text: PGP_MIME_TEXT },
        { value: PGP_INLINE, text: PGP_INLINE_TEXT }
    ];

    const handleChange = ({ target }) => onChange(target.value);

    return <Select options={options} value={value} onChange={handleChange} />;
};

export default ContactSchemeSelect;
