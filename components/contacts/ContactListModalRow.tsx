import React, { CSSProperties, ChangeEvent } from 'react';

import { Checkbox, classnames } from 'react-components';
import { ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';

import ContactGroupLabels from '../../components/contacts/ContactGroupLabels';

interface Props {
    style: CSSProperties;
    onCheck: (e: ChangeEvent<HTMLInputElement>, contactID: string) => void;
    contact: ContactEmail;
    checked: boolean;
    contactGroupMap?: { [key: string]: ContactGroup };
}

const ContactModalRow = ({ style, onCheck, contact, checked, contactGroupMap }: Props) => {
    return (
        <div style={style} className="flex">
            <div
                className={classnames([
                    'flex flex-nowrap w100 h100 mtauto mbauto contact-list-row pl1 pr1',
                    checked && 'contact-list-row--selected'
                ])}
            >
                <Checkbox
                    className="w100 h100"
                    checked={checked}
                    onChange={(e) => onCheck(e, contact.ID)}
                    aria-describedby={contact.ID}
                    id={contact.ID}
                    backgroundColor="white"
                >
                    <div className="flex flex-item-fluid flex-items-center h100">
                        <div className="w33 ml1">{contact.Name}</div>
                        <div className="flex-item-fluid ml1">{contact.Email}</div>
                        <div className="w20 ml1">
                            {contact.LabelIDs.length ? (
                                <ContactGroupLabels contact={contact} contactGroupMap={contactGroupMap} />
                            ) : null}
                        </div>
                    </div>
                </Checkbox>
            </div>
        </div>
    );
};

export default ContactModalRow;
