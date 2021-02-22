import React, { useRef, ChangeEvent } from 'react';
import { c } from 'ttag';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import { DENSITY } from 'proton-shared/lib/constants';
import { List, AutoSizer } from 'react-virtualized';
import { ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { UserSettings } from 'proton-shared/lib/interfaces';
import noContactsImgLight from 'design-system/assets/img/shared/empty-address-book.svg';
import noContactsImgDark from 'design-system/assets/img/shared/empty-address-book-dark.svg';
import noResultsImgLight from 'design-system/assets/img/shared/no-result-search.svg';
import noResultsImgDark from 'design-system/assets/img/shared/no-result-search-dark.svg';
import { IllustrationPlaceholder } from '../illustration';
import { classnames } from '../../helpers';
import ContactGroupRow from './ContactGroupRow';

interface Props {
    groups: ContactGroup[];
    groupsEmailsMap: SimpleMap<ContactEmail[]>;
    onCheckOne: (event: ChangeEvent, contactID: string) => void;
    onCreate: () => void;
    userSettings: UserSettings;
    isDesktop: boolean;
    isSearch: boolean;
    checkedIDs: string[];
    onClick: (contactID: string) => void;
}

const ContactsGroupsList = ({
    groups,
    groupsEmailsMap,
    onCheckOne,
    onCreate,
    userSettings,
    isDesktop = true,
    isSearch = false,
    checkedIDs,
    onClick,
}: Props) => {
    const listRef = useRef<List>(null);
    const containerRef = useRef(null);
    const isCompactView = userSettings.Density === DENSITY.COMPACT;

    if (!groups.length) {
        if (isSearch) {
            const noResultsImg = getLightOrDark(noResultsImgLight, noResultsImgDark);

            return (
                <div className="p2 flex w100">
                    <IllustrationPlaceholder
                        title={c('Info message').t`No results found.`}
                        url={noResultsImg}
                        className="mtauto mbauto"
                    />
                </div>
            );
        }

        const noContactsImg = getLightOrDark(noContactsImgLight, noContactsImgDark);

        return (
            <div className="p2 flex w100">
                <IllustrationPlaceholder
                    title={c('Info message').t`You don't have any groups.`}
                    url={noContactsImg}
                    className="mtauto mbauto"
                >
                    <div className="flex flex-align-items-center">
                        <button
                            key="add"
                            type="button"
                            className="color-primary ml0-5 mr0-5 text-underline"
                            onClick={onCreate}
                        >
                            {c('Action').t`Add a group`}
                        </button>
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
                                <ContactGroupRow
                                    style={style}
                                    key={key}
                                    checked={checkedIDs.includes(groups[index].ID)}
                                    groupsEmailsMap={groupsEmailsMap}
                                    group={groups[index]}
                                    onClick={onClick}
                                    onCheck={(event) => onCheckOne(event, groups[index].ID)}
                                />
                            )}
                            rowCount={groups.length}
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

export default ContactsGroupsList;
