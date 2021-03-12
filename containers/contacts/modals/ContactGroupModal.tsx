import React, { useState, ChangeEvent } from 'react';
import { c, msgid } from 'ttag';

import { randomIntFromInterval, noop } from 'proton-shared/lib/helpers/function';
import { diff, orderBy } from 'proton-shared/lib/helpers/array';
import { LABEL_COLORS } from 'proton-shared/lib/constants';
import { createContactGroup, updateLabel } from 'proton-shared/lib/api/labels';
import { labelContactEmails, unLabelContactEmails } from 'proton-shared/lib/api/contacts';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';

import {
    FormModal,
    Input,
    Row,
    Field,
    Label,
    ColorPicker,
    ContactGroupTable,
    Icon,
    Autocomplete,
} from '../../../components';
import { useContactEmails, useNotifications, useContactGroups, useApi, useEventManager } from '../../../hooks';

import './ContactGroupModal.scss';

const mapIDs = (contactEmails: ContactEmail[]) => contactEmails.map(({ ID }) => ID);

interface Props {
    contactGroupID?: string;
    selectedContactEmails?: ContactEmail[];
    onClose?: () => void;
}

const ContactGroupModal = ({ contactGroupID, onClose = noop, selectedContactEmails = [], ...rest }: Props) => {
    const [loading, setLoading] = useState(false);
    const { call } = useEventManager();
    const api = useApi();
    const { createNotification } = useNotifications();
    const [contactGroups = []] = useContactGroups();
    const [contactEmails] = useContactEmails();
    const [value, setValue] = useState('');

    const contactGroup = contactGroupID && contactGroups.find(({ ID }) => ID === contactGroupID);
    const existingContactEmails =
        contactGroupID &&
        contactEmails.filter(({ LabelIDs = [] }: { LabelIDs: string[] }) => LabelIDs.includes(contactGroupID));
    const title = contactGroupID ? c('Title').t`Edit contact group` : c('Title').t`Create new group`;

    const [model, setModel] = useState({
        name: contactGroupID && contactGroup ? contactGroup.Name : '',
        color:
            contactGroupID && contactGroup
                ? contactGroup.Color
                : LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
        contactEmails: contactGroupID ? existingContactEmails : selectedContactEmails,
    });
    const contactEmailIDs = model.contactEmails.map(({ ID }: ContactEmail) => ID);

    const options = orderBy(contactEmails as ContactEmail[], 'Email').filter(
        ({ ID }: ContactEmail) => !contactEmailIDs.includes(ID)
    );

    const handleChangeName = ({ target }: ChangeEvent<HTMLInputElement>) => setModel({ ...model, name: target.value });
    const handleChangeColor = (color: string) => setModel({ ...model, color });

    const handleSelect = (newContactEmail: ContactEmail) => {
        setModel((model) => ({
            ...model,
            contactEmails: [...model.contactEmails, newContactEmail],
        }));
        setValue('');
    };

    const handleDeleteEmail = (contactEmailID: string) => {
        const index = model.contactEmails.findIndex(({ ID }: ContactEmail) => ID === contactEmailID);

        if (index > -1) {
            const copy = [...model.contactEmails];
            copy.splice(index, 1);
            setModel({ ...model, contactEmails: copy });
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const contactGroupParams = { Name: model.name, Color: model.color };
            const { Label } = await api(
                contactGroupID
                    ? updateLabel(contactGroupID, contactGroupParams)
                    : createContactGroup(contactGroupParams)
            );
            const { ID } = Label;
            const toLabel = mapIDs(model.contactEmails);
            const toUnlabel = contactGroupID ? diff(mapIDs(existingContactEmails), toLabel) : [];
            await Promise.all(
                [
                    toLabel.length && api(labelContactEmails({ LabelID: ID, ContactEmailIDs: toLabel })),
                    toUnlabel.length && api(unLabelContactEmails({ LabelID: ID, ContactEmailIDs: toUnlabel })),
                ].filter(Boolean)
            );
            await call();
            onClose();
            createNotification({
                text: contactGroupID
                    ? c('Notification').t`Contact group updated`
                    : c('Notification').t`Contact group created`,
            });
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const contactEmailsLength = model.contactEmails.length;

    return (
        <FormModal
            onSubmit={handleSubmit}
            loading={loading}
            submit={c('Action').t`Save`}
            title={title}
            onClose={onClose}
            {...rest}
        >
            <h4 className="mb1 flex flex-align-items-center">
                <Icon className="mr0-5" name="info" />
                <span>{c('Title').t`Group information`}</span>
            </h4>
            <Row>
                <Label htmlFor="contactGroupName">{c('Label for contact group name').t`Name`}</Label>
                <Field>
                    <Input
                        id="contactGroupName"
                        placeholder={c('Placeholder for contact group name').t`Name`}
                        value={model.name}
                        onChange={handleChangeName}
                    />
                </Field>
            </Row>
            <Row className="border-bottom pb1 mb1">
                <Label htmlFor="contactGroupColor">{c('Label for contact group color').t`Color`}</Label>
                <Field>
                    <ColorPicker color={model.color} onChange={handleChangeColor} />
                </Field>
            </Row>
            <h4 className="mb1 flex flex-align-items-center">
                <Icon className="mr0-5" name="contacts-groups" />
                <span>{c('Title').t`Group members`}</span>
            </h4>

            {options.length ? (
                <Row>
                    <Label htmlFor="contactGroupEmail">{c('Label').t`Add email address`}</Label>
                    <Field>
                        <Autocomplete
                            id="contactGroupEmail"
                            options={options}
                            limit={6}
                            value={value}
                            onChange={setValue}
                            getData={({ Email, Name }) => (Email === Name ? `<${Email}>` : `${Name} <${Email}>`)}
                            type="search"
                            placeholder={c('Placeholder').t`Start typing an email address`}
                            onSelect={handleSelect}
                        />
                    </Field>
                </Row>
            ) : null}

            <ContactGroupTable contactEmails={model.contactEmails} onDelete={handleDeleteEmail} />

            {contactEmailsLength ? (
                <div className="text-center opacity-50">
                    {c('Info').ngettext(
                        msgid`${contactEmailsLength} Member`,
                        `${contactEmailsLength} Members`,
                        contactEmailsLength
                    )}
                </div>
            ) : null}
        </FormModal>
    );
};

export default ContactGroupModal;
