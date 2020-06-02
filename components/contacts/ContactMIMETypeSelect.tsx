import React, { ChangeEvent } from 'react';
import { c } from 'ttag';

import { Select } from 'react-components';
import { MIME_TYPES } from 'proton-shared/lib/constants';

interface Props {
    value: string;
    onChange: (mimeType: MIME_TYPES | string) => void;
    disabled: boolean;
}

const ContactMIMETypeSelect = ({ value, onChange, disabled }: Props) => {
    const options = [
        { text: c('MIME type').t`Automatic`, value: '' },
        { text: c('MIME type').t`Plain text`, value: MIME_TYPES.PLAINTEXT }
    ];
    const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => onChange(target.value);
    return <Select value={value} options={options} disabled={disabled} onChange={handleChange} />;
};

export default ContactMIMETypeSelect;
