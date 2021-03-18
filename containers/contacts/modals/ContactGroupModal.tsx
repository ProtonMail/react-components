import React, { useState, ChangeEvent, useRef, useMemo } from 'react';
import { c, msgid } from 'ttag';
import { randomIntFromInterval, noop } from 'proton-shared/lib/helpers/function';
import { diff, orderBy } from 'proton-shared/lib/helpers/array';
import { LABEL_COLORS } from 'proton-shared/lib/constants';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { validateEmailAddress } from 'proton-shared/lib/helpers/email';
import {
    FormModal,
    Input,
    Row,
    Field,
    Label,
    ColorPicker,
    ContactGroupTable,
    Autocomplete,
    Button,
} from '../../../components';
import { useContactEmails, useContactGroups, useEventListener } from '../../../hooks';
import useUpdateGroup from '../useUpdateGroup';

import './ContactGroupModal.scss';

interface Props {
    contactGroupID?: string;
    selectedContactEmails?: ContactEmail[];
    onClose?: () => void;
}

const ContactGroupModal = ({ contactGroupID, onClose = noop, selectedContactEmails = [], ...rest }: Props) => {
    const [loading, setLoading] = useState(false);
    const [contactGroups = []] = useContactGroups();
    const [contactEmails] = useContactEmails();
    const [value, setValue] = useState('');
    const updateGroup = useUpdateGroup();
    const autocompleteRef = useRef<HTMLDivElement>(null);

    const isValidEmail = useMemo(() => validateEmailAddress(value), [value]);

    const contactGroup = contactGroupID && contactGroups.find(({ ID }) => ID === contactGroupID);
    const existingContactEmails =
        contactGroupID &&
        contactEmails.filter(({ LabelIDs = [] }: { LabelIDs: string[] }) => LabelIDs.includes(contactGroupID));
    const title = contactGroupID ? c('Title').t`Edit contact group` : c('Title').t`Create new group`;

    const [model, setModel] = useState<{ name: string; color: string; contactEmails: ContactEmail[] }>({
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

    const handleAdd = () => {
        if (!isValidEmail) {
            return;
        }
        setModel((model) => ({
            ...model,
            contactEmails: [...model.contactEmails, { Email: value } as ContactEmail],
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

            const toAdd = model.contactEmails.filter(({ ID }) => isTruthy(ID));
            const toCreate = model.contactEmails.filter(({ ID }) => !isTruthy(ID));
            const toRemove = contactGroupID ? diff(existingContactEmails, toAdd) : [];

            await updateGroup({
                groupID: contactGroupID,
                name: model.name,
                color: model.color,
                toAdd,
                toRemove,
                toCreate,
            });

            onClose();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    useEventListener(
        autocompleteRef,
        'keydown',
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (isValidEmail) {
                    handleAdd();
                }
                event.stopPropagation();
                event.preventDefault();
            }
        },
        [autocompleteRef.current]
    );

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
            <Row>
                <Label htmlFor="contactGroupColor">{c('Label for contact group color').t`Color`}</Label>
                <Field>
                    <ColorPicker color={model.color} onChange={handleChangeColor} />
                </Field>
            </Row>
            {options.length ? (
                <div ref={autocompleteRef} className="flex flex-nowrap mb1 on-mobile-flex-column">
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
                            autoComplete="off"
                        />
                    </Field>
                    <div className="flex-item-fluid flex flex-justify-end">
                        <Button onClick={handleAdd} disabled={!isValidEmail}>{c('Action').t`Add`}</Button>
                    </div>
                </div>
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
