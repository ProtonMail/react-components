import React from 'react';
import { c } from 'ttag';

import { Button } from 'react-components';

interface Props {
    value: string;
    onChange: Function;
}

const ContactImageField = ({ value, onChange }: Props) => {
    return (
        <div>
            {value ? (
                <img src={value} referrerPolicy="no-referrer" />
            ) : (
                <Button onClick={onChange}>{c('Action').t`Upload picture`}</Button>
            )}
        </div>
    );
};

export default ContactImageField;
