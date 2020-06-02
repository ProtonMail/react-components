import React, { ChangeEvent } from 'react';
import { parseISO, isValid } from 'date-fns';

import { useModals, Input, TextArea, EmailInput, DateInput, TelInput } from 'react-components';
import { getAllFieldLabels } from 'proton-shared/lib/helpers/contacts';
import { ContactPropertyChange } from 'proton-shared/lib/interfaces/contacts/Contact';

import ContactImageField from './ContactImageField';
import ContactAdrField from './ContactAdrField';
import ContactImageModal from '../../containers/contacts/modals/ContactImageModal';

interface Props {
    field: string;
    uid?: string;
    value: string | string[];
    onChange: (payload: ContactPropertyChange) => void;
}

const ContactFieldProperty = ({ field, value, uid, onChange, ...rest }: Props) => {
    const { createModal } = useModals();
    const labels: { [key: string]: string } = getAllFieldLabels();
    const label = labels[field];

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => onChange({ value: target.value, uid });

    if (field === 'email') {
        return (
            <EmailInput
                value={value as string}
                placeholder={labels.email}
                onChange={handleChange}
                autoFocus
                {...rest}
            />
        );
    }

    if (field === 'tel') {
        return <TelInput value={value} placeholder={labels.tel} onChange={handleChange} autoFocus {...rest} />;
    }

    if (field === 'adr') {
        const handleChangeAdr = (adr: string[]) => onChange({ value: adr, uid });
        return <ContactAdrField value={value} onChange={handleChangeAdr} />;
    }

    if (field === 'note') {
        return <TextArea value={value} placeholder={labels.note} onChange={handleChange} autoFocus {...rest} />;
    }

    if (field === 'bday' || field === 'anniversary') {
        const date = value === '' ? new Date() : parseISO(`${value}`);
        if (isValid(date)) {
            const handleSelectDate = (value?: Date) => {
                if (!isValid(value)) {
                    return;
                }
                onChange({ value: value?.toISOString() || '', uid });
            };
            return <DateInput placeholder={label} value={date} autoFocus onChange={handleSelectDate} {...rest} />;
        }
    }

    if (field === 'photo' || field === 'logo') {
        const handleChangeImage = () => {
            const handleSubmit = (value: string) => onChange({ uid, value });
            createModal(<ContactImageModal url={value as string} onSubmit={handleSubmit} />);
        };
        return <ContactImageField value={value as string} onChange={handleChangeImage} {...rest} />;
    }
    return <Input value={value} placeholder={label} onChange={handleChange} autoFocus {...rest} />;
};

export default ContactFieldProperty;
