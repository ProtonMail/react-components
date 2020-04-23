import React, { useState, useEffect, useRef, MouseEvent, ChangeEvent, RefObject } from 'react';
import { c } from 'ttag';
import { useModals, IllustrationPlaceholder, LinkButton, classnames } from 'react-components';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import { DENSITY } from 'proton-shared/lib/constants';
import { UserModel } from 'proton-shared/lib/interfaces';
import { UserSettings } from 'proton-shared/lib/interfaces/UserSettings';
import { Contact } from 'proton-shared/lib/interfaces/Contact';
import { CachedKey } from 'proton-shared/lib/interfaces';

import noContactsImgLight from 'design-system/assets/img/shared/empty-address-book.svg';
import noContactsImgDark from 'design-system/assets/img/shared/empty-address-book-dark.svg';
import noResultsImgLight from 'design-system/assets/img/shared/no-result-search.svg';
import noResultsImgDark from 'design-system/assets/img/shared/no-result-search-dark.svg';

import ImportModal from './ImportContactModal';
import ContactModal from './ContactModal';
import ContactGroupModal from './ContactGroupModal';
import ContactRow from './ContactRow';

interface Props {
    totalContacts: number;
    totalContactsInGroup: number;
    contacts: Contact[];
    contactGroupsMap: object;
    onCheck: (contactIDs: string[], state: boolean) => void;
    onClick: (contactID: string) => void;
    onClearSearch: () => void;
    onAddContact: () => void;
    user: UserModel;
    userSettings: UserSettings;
    userKeysList: CachedKey[];
    loadingUserKeys: boolean;
    contactID: string;
    contactGroupID: string;
    isDesktop: boolean;
}

const ContactsList = ({
    totalContacts,
    totalContactsInGroup,
    contacts,
    contactGroupsMap,
    onCheck,
    onClick,
    onClearSearch,
    onAddContact,
    user,
    userSettings,
    userKeysList,
    loadingUserKeys,
    contactID,
    contactGroupID,
    isDesktop = true
}: Props) => {
    const listRef = useRef<any>(null);
    const containerRef = useRef<RefObject<HTMLDivElement> | null>(null);
    const [lastChecked, setLastChecked] = useState<string>(''); // Store ID of the last contact ID checked
    const { createModal } = useModals();
    const isCompactView = userSettings.Density === DENSITY.COMPACT;

    const noContactsImg = getLightOrDark(noContactsImgLight, noContactsImgDark);

    const handleImport = () => {
        createModal(<ImportModal userKeysList={userKeysList} />);
    };

    // onAddContact
    // const handleAddContact = () => {
    //     createModal(<ContactModal history={history} onAdd={onClearSearch} />);
    // };

    const handleEditGroup = (contactGroupID: string) => {
        createModal(<ContactGroupModal contactGroupID={contactGroupID} />);
    };

    const handleCheck = ({ target, nativeEvent }: ChangeEvent<HTMLInputElement>) => {
        const contactID = target.getAttribute('data-contact-id');
        const contactIDs = contactID ? [contactID] : [];

        if (lastChecked && nativeEvent.shiftKey) {
            const start = contacts.findIndex(({ ID }) => ID === contactID);
            const end = contacts.findIndex(({ ID }) => ID === lastChecked);
            contactIDs.push(...contacts.slice(Math.min(start, end), Math.max(start, end) + 1).map(({ ID }) => ID));
        }

        if (contactID) {
            setLastChecked(contactID);
            onCheck(contactIDs, target.checked);
        }
    };

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (contactID && totalContacts) {
                const index = contacts.findIndex(({ ID }) => contactID === ID);
                if (listRef && listRef.current) {
                    listRef.current.scrollToRow(index);
                }
            }
        }, 200);

        return () => {
            clearTimeout(timeoutID);
        };
    }, [contactID]);

    if (!totalContacts) {
        const addContact = (
            <button key="add" type="button" className="color-primary ml0-5 mr0-5 underline" onClick={onAddContact}>
                {c('Action').t`Add a contact`}
            </button>
        );
        const importContact = (
            <button
                key="import"
                type="button"
                className="color-primary ml0-5 mr0-5 underline"
                onClick={handleImport}
                disabled={loadingUserKeys}
            >
                {c('Action').t`Import contact`}
            </button>
        );

        return (
            <div className="p2 flex w100">
                <IllustrationPlaceholder
                    title={c('Info message').t`Your address book is empty`}
                    url={noContactsImg}
                    className="mtauto mbauto"
                >
                    <div className="flex flex-items-center">
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
                    className="color-primary ml0-5 mr0-5 underline"
                    onClick={() => handleEditGroup(contactGroupID)}
                >
                    {c('Action').t`Edit your group`}
                </button>
            );

            return (
                <div className="p2 aligncenter w100">
                    <IllustrationPlaceholder
                        title={c('Info message').t`Your contact group is empty`}
                        url={noContactsImg}
                    >
                        <div className="flex flex-items-center">
                            {c('Actions message').jt`You can ${editGroup} to add a contact.`}
                        </div>
                    </IllustrationPlaceholder>
                </div>
            );
        }

        const clearSearch = (
            <LinkButton key="add" onClick={onClearSearch} className="ml0-25 bold">
                {c('Action').t`Clear it`}
            </LinkButton>
        );

        const noResultsImg = getLightOrDark(noResultsImgLight, noResultsImgDark);

        return (
            <div className="p2 aligncenter w100">
                <IllustrationPlaceholder title={c('Info message').t`No results found`} url={noResultsImg}>
                    <div className="flex flex-items-center">
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
                isCompactView && 'is-compact'
            ])}
        >
            <div className="items-column-list-inner items-column-list-inner--noborder">
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
                                    hasPaidMail={!!user.hasPaidMail}
                                    contactGroupsMap={contactGroupsMap}
                                    contact={contacts[index]}
                                    onClick={onClick}
                                    onCheck={handleCheck}
                                    userSettings={userSettings}
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
