import React from 'react';
import { c } from 'ttag';

import { Select } from 'react-components';
import { MIME_TYPES } from 'proton-shared/lib/constants';

interface Props {
    value: string;
    onChange: Function;
    disabled: boolean;
}

const ContactMIMETypeSelect = ({ value, onChange, disabled }: Props) => {
    const options = [
        { text: c('MIME type').t`Automatic`, value: undefined },
        { text: c('MIME type').t`Plain text`, value: MIME_TYPES.PLAINTEXT }
    ];
    const handleChange = ({ target }) => onChange(target.value);
    return <Select value={value} options={options} disabled={disabled} onChange={handleChange} />;
};

export default ContactMIMETypeSelect;
