import React from 'react';
import { ContactGroup, ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';

interface Props {
    contact: ContactEmail;
    contactGroupMap?: { [key: string]: ContactGroup };
}

const ContactGroupLabels = ({ contact, contactGroupMap = {} }: Props) => (
    <div className="inline-flex flew-row flex-items-center pm-badgeLabel-container stop-propagation">
        {contact.LabelIDs.map((ID: string) => {
            const contactGroup: ContactGroup = contactGroupMap[ID];

            return contactGroup ? (
                <span
                    className="badgeLabel flex flex-row flex-items-center ml0-25"
                    style={{
                        backgroundColor: contactGroup.Color,
                        borderColor: contactGroup.Color
                    }}
                    key={ID}
                >
                    {contactGroup.Name}
                </span>
            ) : null;
        })}
    </div>
);

export default ContactGroupLabels;
