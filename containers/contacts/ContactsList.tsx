import React, { useEffect, useRef, ChangeEvent } from 'react';
import { DENSITY } from 'proton-shared/lib/constants';
import { List, AutoSizer } from 'react-virtualized';
import { ContactFormatted, ContactGroup } from 'proton-shared/lib/interfaces/contacts';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { UserModel, UserSettings } from 'proton-shared/lib/interfaces';
import ContactRow from './ContactRow';
import { useItemsDraggable } from '../items';
import { classnames } from '../../helpers';

interface Props {
    totalContacts: number;
    contacts: ContactFormatted[];
    contactGroupsMap: SimpleMap<ContactGroup>;
    onCheckOne: (event: ChangeEvent, contactID: string) => void;
    user: UserModel;
    userSettings: UserSettings;
    contactID: string;
    isDesktop: boolean;
    onCheck: (contactIDs: string[], checked: boolean, replace: boolean) => void;
    checkedIDs: string[];
    onClick: (contactID: string) => void;
    activateDrag?: boolean;
}

const ContactsList = ({
    totalContacts,
    contacts,
    contactGroupsMap,
    onCheckOne,
    user,
    userSettings,
    contactID,
    isDesktop = true,
    onCheck,
    checkedIDs,
    onClick,
    activateDrag = true,
}: Props) => {
    const listRef = useRef<List>(null);
    const containerRef = useRef(null);
    const isCompactView = userSettings.Density === DENSITY.COMPACT;

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

    // Useless if activateDrag is false but hook has to be run anyway
    const { draggedIDs, handleDragStart, handleDragEnd } = useItemsDraggable(
        contacts,
        checkedIDs,
        onCheck,
        (draggedIDs: string[]) => {
            return `${draggedIDs.length} contacts`;
        }
    );

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
                                    draggable={activateDrag}
                                    onDragStart={(event) => handleDragStart?.(event, contacts[index])}
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
