import React from 'react';

import { Select, Label } from 'react-components';
import { getOtherInformationFields, getAllTypes } from 'proton-shared/lib/helpers/contacts';

import ContactLabelProperty from './ContactLabelProperty';

interface Props {
    field: string;
    uid: string;
    type?: string;
    onChange: Function;
}

const ContactModalLabel = ({ field, uid, type = '', onChange }: Props) => {
    const types = getAllTypes();

    const otherInformationFields = getOtherInformationFields();

    const handleChangeType = ({ target }) => onChange({ value: target.value, key: 'type', uid });
    const handleChangeField = ({ target }) => onChange({ value: target.value, key: 'field', uid });

    if (otherInformationFields.map(({ value: f }) => f).includes(field)) {
        return (
            <Label className="pt0 mr1">
                <Select value={field} options={otherInformationFields} onChange={handleChangeField} />
            </Label>
        );
    }

    if (field === 'fn' || !types[field].map(({ value: type }) => type).includes(type)) {
        return <ContactLabelProperty field={field} type={type} />;
    }

    return (
        <Label className="pt0 mr1">
            <Select value={type} options={types[field]} onChange={handleChangeType} />
        </Label>
    );
};

export default ContactModalLabel;
