import React, { useState } from 'react';
import { c } from 'ttag';

import { FormModal, Alert, Row, Label, Field, Checkbox, useContactEmails } from 'react-components';
import { Contact } from 'proton-shared/lib/interfaces/contacts';

interface Props {
    contacts: Contact[];
    onSubmit: Function;
}

/**
 * Modal to select contact emails and add them to a contact group
 * @param {Array} props.contacts contacts selected
 * @param {Function} props.onSubmit only submit checked contactEmails (Array<Object>)
 * @param {Function} props.onClose
 */
const SelectEmailsModal = ({ contacts, onSubmit, ...rest }: Props) => {
    const [contactEmails] = useContactEmails();
    const [model, setModel] = useState(
        contacts.map((contact) => {
            return {
                ...contact,
                contactEmails: contactEmails
                    .filter(({ ContactID }) => ContactID === contact.ID)
                    .map((contactEmail) => ({ ...contactEmail, isChecked: true }))
            };
        })
    );

    const handleSubmit = () => {
        const toSubmit = model.reduce((acc, contact) => {
            contact.contactEmails.forEach(({ isChecked, ...contactEmail }) => {
                if (isChecked) {
                    acc.push(contactEmail);
                }
            });
            return acc;
        }, []);
        onSubmit(toSubmit);
        rest.onClose();
    };

    const handleCheck = (contactID, contactEmailID) => ({ target }) => {
        const copy = [...model];
        const contactIndex = model.findIndex(({ ID }) => ID === contactID);
        const contactEmailIndex = model[contactIndex].contactEmails.findIndex(({ ID }) => ID === contactEmailID);
        copy[contactIndex].contactEmails[contactEmailIndex].isChecked = target.checked;
        setModel(copy);
    };

    return (
        <FormModal submit={c('Action').t`Apply`} title={c('Title').t`Add to group`} onSubmit={handleSubmit} {...rest}>
            <Alert>{c('Info').t`Please select which email address or addresses to add to this group.`}</Alert>
            {model
                .filter(({ contactEmails = [] }) => contactEmails.length > 1) // Only display contact with multiple emails
                .map(({ ID: contactID, Name, contactEmails = [] }) => {
                    return (
                        <Row key={contactID} className="border-bottom">
                            <Label className="bold pt0">{Name}</Label>
                            <Field className="flex flex-column w100">
                                {contactEmails.map(({ ID: contactEmailID, Email, isChecked }) => {
                                    return (
                                        <label key={contactEmailID} className="mb1" htmlFor={contactEmailID}>
                                            <Checkbox
                                                id={contactEmailID}
                                                checked={isChecked}
                                                className="mr0-5"
                                                onChange={handleCheck(contactID, contactEmailID)}
                                            />
                                            <span>{Email}</span>
                                        </label>
                                    );
                                })}
                            </Field>
                        </Row>
                    );
                })}
        </FormModal>
    );
};

export default SelectEmailsModal;
