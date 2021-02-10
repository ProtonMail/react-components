import React, { useEffect, useRef, ChangeEvent } from 'react';
import { c } from 'ttag';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import { DENSITY } from 'proton-shared/lib/constants';
import { List, AutoSizer } from 'react-virtualized';
import { ContactFormatted, ContactGroup } from 'proton-shared/lib/interfaces/contacts';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { UserModel, UserSettings } from 'proton-shared/lib/interfaces';
import noContactsImgLight from 'design-system/assets/img/shared/empty-address-book.svg';
import noContactsImgDark from 'design-system/assets/img/shared/empty-address-book-dark.svg';
import noResultsImgLight from 'design-system/assets/img/shared/no-result-search.svg';
import noResultsImgDark from 'design-system/assets/img/shared/no-result-search-dark.svg';
import ContactRow from './ContactRow';
import { useModals } from '../../hooks';
import ContactModal from './modals/ContactModal';
import ContactGroupModal from './modals/ContactGroupModal';
import { useItemsDraggable } from '../items';
import { IllustrationPlaceholder } from '../illustration';
import { LinkButton } from '../../components';
import { classnames } from '../../helpers';

interface Props {
    totalContacts: number;
    totalContactsInGroup: number | undefined;
    contacts: ContactFormatted[];
    contactGroupsMap: SimpleMap<ContactGroup>;
    onCheckOne: (event: ChangeEvent, contactID: string) => void;
    onClearSearch: () => void;
    onImport?: () => void;
    user: UserModel;
    userSettings: UserSettings;
    loadingUserKeys?: boolean;
    contactID: string;
    contactGroupID: string | undefined;
    isDesktop: boolean;
    onCheck: (contactIDs: string[], checked: boolean, replace: boolean) => void;
    checkedIDs: string[];
    onClick: (contactID: string) => void;
}

const ContactsList = ({
    totalContacts,
    totalContactsInGroup,
    contacts,
    contactGroupsMap,
    onCheckOne,
    onClearSearch,
    onImport,
    user,
    userSettings,
    loadingUserKeys,
    contactID,
    contactGroupID,
    isDesktop = true,
    onCheck,
    checkedIDs,
    onClick,
}: Props) => {
    const listRef = useRef<List>(null);
    const containerRef = useRef(null);
    const { createModal } = useModals();
    const isCompactView = userSettings.Density === DENSITY.COMPACT;

    const noContactsImg = getLightOrDark(noContactsImgLight, noContactsImgDark);

    const handleAddContact = () => {
        createModal(<ContactModal onAdd={onClearSearch} />);
    };
    const handleEditGroup = (contactGroupID: string) => {
        createModal(<ContactGroupModal contactGroupID={contactGroupID} selectedContactEmails={[]} />);
    };

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (contactID && totalContacts) {
                const index = contacts.findIndex(({ ID }) => contactID === ID);
                listRef.current?.scrollToRow(index);
            }
        }, 200);

        return () => {
            clearTimeout(timeoutID);
        };
    }, [contactID]);

    const { draggedIDs, handleDragStart, handleDragEnd } = useItemsDraggable(
        contacts,
        checkedIDs,
        onCheck,
        (draggedIDs: string[]) => {
            return `${draggedIDs.length} contacts`;
        }
    );

    if (!totalContacts) {
        const addContact = (
            <button
                key="add"
                type="button"
                className="color-primary ml0-5 mr0-5 text-underline"
                onClick={handleAddContact}
            >
                {c('Action').t`Add a contact`}
            </button>
        );
        const importContact = (
            <button
                key="import"
                type="button"
                className="color-primary ml0-5 mr0-5 text-underline"
                onClick={onImport}
                disabled={loadingUserKeys}
            >
                {c('Action').t`Import contacts`}
            </button>
        );

        return (
            <div className="p2 flex w100">
                <IllustrationPlaceholder
                    title={c('Info message').t`Your address book is empty`}
                    url={noContactsImg}
                    className="mtauto mbauto"
                >
                    <div className="flex flex-align-items-center">
                        {c('Actions message').jt`You can either ${addContact} or ${importContact} from a file.`}
                    </div>
                </IllustrationPlaceholder>
            </div>
        );
    }

    if (!contacts.length) {
        if (contactGroupID && !totalContactsInGroup) {
            const editGroup = (
                <button
                    key="add"
                    type="button"
                    className="color-primary ml0-5 mr0-5 text-underline"
                    onClick={() => handleEditGroup(contactGroupID)}
                >
                    {c('Action').t`Edit your group`}
                </button>
            );

            return (
                <div className="p2 text-center w100">
                    <IllustrationPlaceholder
                        title={c('Info message').t`Your contact group is empty`}
                        url={noContactsImg}
                    >
                        <div className="flex flex-align-items-center">
                            {c('Actions message').jt`You can ${editGroup} to add a contact.`}
                        </div>
                    </IllustrationPlaceholder>
                </div>
            );
        }

        const clearSearch = (
            <LinkButton key="add" onClick={onClearSearch} className="ml0-25 text-bold">
                {c('Action').t`Clear it`}
            </LinkButton>
        );

        const noResultsImg = getLightOrDark(noResultsImgLight, noResultsImgDark);

        return (
            <div className="p2 text-center w100">
                <IllustrationPlaceholder title={c('Info message').t`No results found`} url={noResultsImg}>
                    <div className="flex flex-align-items-center">
                        {c('Actions message').jt`You can either update your search query or ${clearSearch}.`}
                    </div>
                </IllustrationPlaceholder>
            </div>
        );
    }

    const contactRowHeightComfort = 64;
    const contactRowHeightCompact = 48;

    return (
        <div
            ref={containerRef}
            className={classnames([
                isDesktop ? 'items-column-list' : 'items-column-list--mobile',
                isCompactView && 'is-compact',
            ])}
        >
            <div className="items-column-list-inner items-column-list-inner--no-border">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            className="contacts-list no-outline"
                            ref={listRef}
                            rowRenderer={({ index, style, key }) => (
                                <ContactRow
                                    style={style}
                                    key={key}
                                    contactID={contactID}
                                    checked={checkedIDs.includes(contacts[index].ID)}
                                    hasPaidMail={!!user.hasPaidMail}
                                    contactGroupsMap={contactGroupsMap}
                                    contact={contacts[index]}
                                    onClick={onClick}
                                    onCheck={(event) => onCheckOne(event, contacts[index].ID)}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    dragged={draggedIDs.includes(contacts[index].ID)}
                                />
                            )}
                            rowCount={contacts.length}
                            height={height}
                            width={width - 1}
                            rowHeight={isCompactView ? contactRowHeightCompact : contactRowHeightComfort}
                        />
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default ContactsList;
