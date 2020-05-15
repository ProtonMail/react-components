import React, { useState, ChangeEvent, useEffect } from 'react';
import { c, msgid } from 'ttag';

import {
    Checkbox,
    FormModal,
    SearchInput,
    PrimaryButton,
    useContactEmails,
    useContactGroups,
    useUserSettings
} from 'react-components';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';
import { normalize } from 'proton-shared/lib/helpers/string';

import ContactList from '../ContactList';
import ContactListModalRow from '../../../components/contacts/ContactListModalRow';

import './ContactListModal.scss';
import { toMap } from 'proton-shared/lib/helpers/object';

// interface Recipient {
//     Name?: string;
//     Address?: string;
//     ContactID?: string;
//     Group?: string;
// }

interface Props {
    // onSubmit: (recipients: Recipient[]) => void;
    inputValue: any;
    onSubmit: (test: string) => void;
    onClose?: () => void;
}

const ContactListModal = ({ onSubmit, onClose, inputValue, ...rest }: Props) => {
    const [contactEmails, loadingContactEmails] = useContactEmails();
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [contactGroups = [], loadingContactGroups] = useContactGroups();

    const emailsFromInput = inputValue.map((e: any) => e.Address);
    const contactGroupMap = toMap(contactGroups);

    const initialCheckedContactEmailsMap = contactEmails.reduce(
        (acc: { [key: string]: boolean }, contactEmail: ContactEmail) => {
            acc[contactEmail.ID] = emailsFromInput.includes(contactEmail.Email);
            return acc;
        },
        Object.create(null)
    );

    const [searchValue, setSearchValue] = useState('');
    const [lastCheckedID, setLastCheckedID] = useState('');
    const [isAllChecked, setIsAllChecked] = useState(false);

    const [filteredContactEmails, setFilteredContactEmails] = useState(contactEmails);
    const [checkedContactEmailMap, setCheckedContactEmailMap] = useState<{ [key: string]: boolean }>(
        initialCheckedContactEmailsMap
    );
    const [checkedContactEmails, setCheckedContactEmails] = useState<ContactEmail[]>([]);

    const loading = loadingContactEmails || loadingUserSettings || loadingContactGroups;

    const toggleCheckAll = (checked: boolean) => {
        const update = filteredContactEmails.reduce((acc: { [key: string]: boolean }, contactEmail: ContactEmail) => {
            acc[contactEmail.ID] = checked;
            return acc;
        }, Object.create(null));

        setCheckedContactEmailMap({ ...checkedContactEmailMap, ...update });
    };

    const onCheck = (checkedIDs: string[] = [], checked = false) => {
        const update = checkedIDs.reduce((acc, checkedID) => {
            acc[checkedID] = checked;
            return acc;
        }, Object.create(null));

        setCheckedContactEmailMap({ ...checkedContactEmailMap, ...update });
    };

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => toggleCheckAll(e.target.checked);

    const handleCheck = (e: ChangeEvent<HTMLInputElement>, checkedID: string) => {
        const {
            target,
            nativeEvent
        }: {
            target: EventTarget & HTMLInputElement;
            nativeEvent: Event & { shiftKey?: boolean };
        } = e;
        const checkedIDs = checkedID ? [checkedID] : [];

        if (lastCheckedID && nativeEvent.shiftKey) {
            const start = filteredContactEmails.findIndex((c: ContactEmail) => c.ID === checkedID);
            const end = filteredContactEmails.findIndex((c: ContactEmail) => c.ID === lastCheckedID);
            checkedIDs.push(
                ...filteredContactEmails
                    .slice(Math.min(start, end), Math.max(start, end) + 1)
                    .map((c: ContactEmail) => c.ID)
            );
        }

        if (checkedID) {
            setLastCheckedID(checkedID);
            onCheck(checkedIDs, target.checked);
        }
    };

    const searchFilter = (c: ContactEmail) => {
        const tokenizedQuery = normalize(searchValue).split(' ');

        const groupNameTokens = c.LabelIDs.reduce((acc: string[], labelId) => {
            const tokenized = normalize(contactGroupMap[labelId].Name).split(' ');
            return [...acc, ...tokenized];
        }, []);

        return (
            tokenizedQuery.some((token) => normalize(c.Name).includes(token)) ||
            tokenizedQuery.some((token) => normalize(c.Email).includes(token)) ||
            tokenizedQuery.some((token) => groupNameTokens.includes(token))
        );
    };

    useEffect(() => {
        setLastCheckedID('');
        setFilteredContactEmails(contactEmails.filter(searchFilter));
    }, [searchValue]);

    useEffect(() => {
        setCheckedContactEmails(contactEmails.filter((c: ContactEmail) => !!checkedContactEmailMap[c.ID]));
    }, [checkedContactEmailMap]);

    useEffect(() => {
        setIsAllChecked(
            filteredContactEmails.length &&
                filteredContactEmails.every((c: ContactEmail) => !!checkedContactEmailMap[c.ID])
        );
    }, [filteredContactEmails, checkedContactEmailMap]);

    const handleSearchValue = (value: string) => setSearchValue(value);

    const handleSubmit = () => {
        // console.log('contact emails', checkedContactEmails);
        // console.log('groups', checkedContactGroups);
        onSubmit('test');
        onClose?.();
    };

    return (
        <FormModal
            title={c('Title').t`Insert contacts`}
            loading={loading}
            onSubmit={handleSubmit}
            submit={
                <PrimaryButton loading={loading} type="submit" disabled={!checkedContactEmails.length}>
                    {c('Action').ngettext(
                        msgid`Insert contact`,
                        `Insert ${checkedContactEmails.length} contacts`,
                        checkedContactEmails.length | 1
                    )}
                </PrimaryButton>
            }
            onClose={onClose}
            {...rest}
        >
            <div className="mb0-5">
                <SearchInput
                    value={searchValue}
                    onChange={handleSearchValue}
                    placeholder={c('Placeholder').t`Search name, email or group`}
                />
            </div>
            <div className="flex flex-nowrap w100 contact-list-row p1">
                <div>
                    <Checkbox className="w100 h100" checked={isAllChecked} onChange={handleCheckAll} />
                </div>
                <div className="flex flex-item-fluid flex-self-vcenter">
                    <div className="w33 ml1">
                        <strong className="uppercase">Name</strong>
                    </div>
                    <div className="flex-item-fluid ml1">
                        <strong className="uppercase">Email</strong>
                    </div>
                    <div className="w20 ml1">
                        <strong className="uppercase">Group</strong>
                    </div>
                </div>
            </div>
            <ContactList
                rowCount={filteredContactEmails.length}
                userSettings={userSettings}
                isDesktop={false}
                rowRenderer={({ index, style }) => (
                    <ContactListModalRow
                        onCheck={handleCheck}
                        style={style}
                        key={filteredContactEmails[index].ID}
                        contact={filteredContactEmails[index]}
                        checked={!!checkedContactEmailMap[filteredContactEmails[index].ID]}
                        contactGroupMap={contactGroupMap}
                    />
                )}
            />
        </FormModal>
    );
};

export default ContactListModal;
