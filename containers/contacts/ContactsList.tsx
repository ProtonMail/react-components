import React, { useRef, CSSProperties } from 'react';
import { classnames } from 'react-components';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { DENSITY } from 'proton-shared/lib/constants';
import { UserSettings } from 'proton-shared/lib/interfaces/UserSettings';
import { Contact } from 'proton-shared/lib/interfaces/contacts/Contact';

interface Props {
    contacts: Contact[];
    isDesktop?: boolean;
    userSettings: UserSettings;
    contactRowHeightComfort?: number;
    contactRowHeightCompact?: number;
    rowRenderer: ({ index, style, key }: { index: number; style: CSSProperties; key: string }) => React.ReactNode;
}

const ContactsList = ({
    contacts,
    contactRowHeightComfort = 64,
    contactRowHeightCompact = 48,
    rowRenderer,
    userSettings,
    isDesktop = true
}: Props) => {
    const listRef = useRef(null);
    const containerRef = useRef(null);
    const isCompactView = userSettings.Density === DENSITY.COMPACT;

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
                    {({ height, width }: { height: number; width: number }) => (
                        <List
                            className="contacts-list no-outline"
                            ref={listRef}
                            rowRenderer={rowRenderer}
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
