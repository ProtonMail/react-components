import React, { useMemo, useState } from 'react';
import { c, msgid } from 'ttag';
import { Recipient } from 'proton-shared/lib/interfaces';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { normalize } from 'proton-shared/lib/helpers/string';
import { FullLoader, SearchInput } from '../../../components';
import { useContactEmails, useContactGroups, useModals, useNotifications, useUserSettings } from '../../../hooks';
import ContactsWidgetGroupsToolbar from './ContactsWidgetGroupsToolbar';
import ContactsGroupsList from '../ContactsGroupsList';
import { useItemsSelection } from '../../items';
import ContactGroupModal from '../modals/ContactGroupModal';
import ContactGroupDetailsModal from '../modals/ContactGroupDetailsModal';

interface Props {
    onClose: () => void;
    onCompose?: (recipients: Recipient[], attachments: File[]) => void;
}

const ContactsWidgetGroupsContainer = ({ onClose, onCompose }: Props) => {
    const [userSettings, loadingUserSettings] = useUserSettings();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();

    const [search, setSearch] = useState('');

    const [groups = [], loadingGroups] = useContactGroups();
    const [contactEmails = [], loadingContactEmails] = useContactEmails() as [ContactEmail[], boolean, any];

    const normalizedSearch = normalize(search);

    const filteredGroups = useMemo(() => groups.filter(({ Name }) => normalize(Name).includes(normalizedSearch)), [
        groups,
        normalizedSearch,
    ]);

    const groupIDs = filteredGroups.map((group) => group.ID);

    const { checkedIDs, selectedIDs, handleCheckAll, handleCheckOne } = useItemsSelection(undefined, groupIDs, []);

    const allChecked = checkedIDs.length === filteredGroups.length;

    const groupsEmailsMap = useMemo(
        () =>
            contactEmails.reduce<{ [groupID: string]: ContactEmail[] }>((acc, contactEmail) => {
                contactEmail.LabelIDs.forEach((labelID) => {
                    if (!acc[labelID]) {
                        acc[labelID] = [];
                    }
                    acc[labelID].push(contactEmail);
                });
                return acc;
            }, {}),
        [groups, contactEmails]
    );

    const handleCompose = () => {
        const recipients = selectedIDs
            .map((selectedID) => {
                const group = groups.find((group) => group.ID === selectedID);
                return groupsEmailsMap[selectedID].map((email) => ({
                    Name: email.Name,
                    Address: email.Email,
                    Group: group?.Path,
                }));
            })
            .flat();

        if (recipients.length > 100) {
            createNotification({
                type: 'error',
                text: c('Error').t`You can't send a mail to more than 100 recipients`,
            });
            return;
        }

        onCompose?.(recipients, []);
        onClose();
    };

    const handleDetails = (groupID: string) => {
        createModal(<ContactGroupDetailsModal contactGroupID={groupID} />);
        onClose();
    };

    const handleCreate = () => {
        createModal(<ContactGroupModal />);
        onClose();
    };

    const loading = loadingGroups || loadingContactEmails || loadingUserSettings;
    const groupCounts = filteredGroups.length;

    return (
        <div className="flex flex-column flex-nowrap h100">
            <div className="contacts-widget-search-container flex-item-noshrink">
                <label htmlFor="id_contact-widget-search" className="sr-only">{c('Placeholder')
                    .t`Search for group name`}</label>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    id="id_contact-widget-group-search"
                    placeholder={c('Placeholder').t`Search for group name`}
                />
                <span className="sr-only" aria-atomic aria-live="assertive">
                    {c('Info').ngettext(msgid`${groupCounts} group found`, `${groupCounts} groups found`, groupCounts)}
                </span>
            </div>
            <div className="contacts-widget-toolbar pt1 pb1 border-bottom flex-item-noshrink">
                <ContactsWidgetGroupsToolbar
                    allChecked={allChecked}
                    oneSelected={!!selectedIDs.length}
                    onCheckAll={handleCheckAll}
                    onCompose={handleCompose}
                    onCreate={handleCreate}
                />
            </div>
            <div className="flex-item-fluid w100">
                {loading ? (
                    <div className="flex h100">
                        <FullLoader className="mauto color-primary" />
                    </div>
                ) : (
                    <ContactsGroupsList
                        groups={filteredGroups}
                        groupsEmailsMap={groupsEmailsMap}
                        userSettings={userSettings}
                        onCheckOne={handleCheckOne}
                        onCreate={handleCreate}
                        isDesktop={false}
                        isSearch={search !== ''}
                        checkedIDs={checkedIDs}
                        onClick={handleDetails}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactsWidgetGroupsContainer;
