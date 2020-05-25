import React, { ChangeEvent } from 'react';
import { parseISO, isValid } from 'date-fns';

import { useModals, Input, TextArea, EmailInput, DateInput, TelInput } from 'react-components';
import { getAllFieldLabels } from 'proton-shared/lib/helpers/contacts';

import ContactImageField from './ContactImageField';
import ContactAdrField from './ContactAdrField';
import ContactImageModal from '../../containers/contacts/modals/ContactImageModal';

interface Props {
    field: string;
    uid: string;
    value: string | string[] | object;
    onChange: Function;
}

const ContactFieldProperty = ({ field, value, uid, onChange, ...rest }: Props) => {
    const { createModal } = useModals();
    const labels = getAllFieldLabels();

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => onChange({ value: target.value, uid });

    if (field === 'email') {
        return <EmailInput value={value} placeholder={labels.email} onChange={handleChange} {...rest} />;
    }

    if (field === 'tel') {
        return <TelInput value={value} placeholder={labels.tel} onChange={handleChange} {...rest} />;
    }

    if (field === 'adr') {
        const handleChangeAdr = (adr) => onChange({ value: adr, uid });
        return <ContactAdrField value={value} onChange={handleChangeAdr} />;
    }

    if (field === 'note') {
        return <TextArea value={value} placeholder={labels.note} onChange={handleChange} {...rest} />;
    }

    if (field === 'bday' || field === 'anniversary') {
        const date = value === '' ? new Date() : parseISO(value);
        if (isValid(date)) {
            const handleSelectDate = (newDate) => {
                if (!isValid(newDate)) {
                    return;
                }
                onChange({ value: newDate.toISOString(), uid });
            };
            return <DateInput placeholder={labels[field]} value={date} onChange={handleSelectDate} {...rest} />;
        }
    }

    if (field === 'photo' || field === 'logo') {
        const handleChangeImage = () => {
            const handleSubmit = (value) => onChange({ uid, value });
            createModal(<ContactImageModal url={value} onSubmit={handleSubmit} />);
        };
        return <ContactImageField value={value} onChange={handleChangeImage} {...rest} />;
    }
    return <Input value={value} placeholder={labels[field]} onChange={handleChange} {...rest} />;
};

export default ContactFieldProperty;
