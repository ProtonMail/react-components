import React, { CSSProperties, ChangeEvent } from 'react';
import { ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { UserModel } from 'proton-shared/lib/interfaces';
import { Checkbox } from 'react-components';

import { ContactFormatted } from './interfaces';
import ContactGroupIcon from './ContactGroupIcon';

interface Props {
    style: CSSProperties;
    key: string;
    onClick: (contactID: string) => void;
    onCheck: (e: ChangeEvent<HTMLInputElement>, contactID: string) => void;
    contact: ContactFormatted;
    user: UserModel;
    contactGroupsMap: {
        [contactGroupID: string]: ContactGroup;
    };
}

const ContactModalRow = ({ style, key, onClick, onCheck, contact, user, contactGroupsMap }: Props) => {
    return (
        <div style={style} key={key} onClick={() => onClick(contact.ID)}>
            <Checkbox
                checked={contact.isChecked}
                onChange={(e) => onCheck(e, contact.ID)}
                labelOnClick={(e) => e.stopPropagation()}
                aria-describedby={contact.ID}
            />
            {contact.Name}
            {contact.emails.join(', ')}
            {user.hasPaidMail && contact.LabelIDs.length ? (
                <div>
                    {contact.LabelIDs.map((labelID) => {
                        if (!contactGroupsMap[labelID]) {
                            return null;
                        }
                        const { Color, Name } = contactGroupsMap[labelID];
                        return (
                            <ContactGroupIcon
                                scrollContainerClass="contacts-list"
                                key={labelID}
                                name={Name}
                                color={Color}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default ContactModalRow;
