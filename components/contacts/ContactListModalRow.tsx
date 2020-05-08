import React, { CSSProperties, ChangeEvent } from 'react';

import { Checkbox } from 'react-components';
import { ContactFormatted } from 'proton-shared/lib/interfaces/contacts/Contact';

interface Props {
    style: CSSProperties;
    onCheck: (e: ChangeEvent<HTMLInputElement>, contactID: string) => void;
    contact: ContactFormatted;
}

const ContactModalRow = ({ style, onCheck, contact }: Props) => {
    return (
        <div style={style}>
            <Checkbox
                checked={contact.isChecked}
                onChange={(e) => onCheck(e, contact.ID)}
                aria-describedby={contact.ID}
                className="w100"
            >
                <span className="flex-item-fluid flex-self-vcenter">{contact.Name}</span>
                <span className="flex-item-fluid flex-self-vcenter">{contact.emails.join(', ')}</span>
            </Checkbox>
        </div>
    );
};

export default ContactModalRow;
