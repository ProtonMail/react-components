import React from 'react';
import { c } from 'ttag';

import { Button } from '../button';

import './ContactImageField.scss';

interface Props {
    value: string;
    onChange: () => void;
}

const ContactImageField = ({ value, onChange }: Props) => {
    return (
        <div>
            {value ? (
                <img className="remote-contact-image" src={value} referrerPolicy="no-referrer" />
            ) : (
                <Button onClick={onChange}>{c('Action').t`Upload picture`}</Button>
            )}
        </div>
    );
};

export default ContactImageField;
