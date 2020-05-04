import React, { CSSProperties, ChangeEvent } from 'react';
import { ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { UserModel } from 'proton-shared/lib/interfaces';
import { Checkbox } from 'react-components';

import { ContactFormatted } from './interfaces';
import ContactGroupIcon from './ContactGroupIcon';

interface Props {
    style: CSSProperties;
    onClick: (contactID: string) => void;
    onCheck: (e: ChangeEvent<HTMLInputElement>, contactID: string) => void;
    contact: ContactFormatted;
    user: UserModel;
    contactGroupsMap: {
        [contactGroupID: string]: ContactGroup;
    };
}

const ContactModalRow = ({ style, onClick, onCheck, contact, user, contactGroupsMap }: Props) => {
    return (
        <div style={style} onClick={() => onClick(contact.ID)}>
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
                                key={labelID}
                                scrollContainerClass="contacts-list"
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
