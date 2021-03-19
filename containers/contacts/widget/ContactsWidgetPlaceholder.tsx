import React, { ReactNode, MouseEvent } from 'react';
import { c } from 'ttag';
import noContactsImgLight from 'design-system/assets/img/shared/empty-address-book.svg';
import noContactsImgDark from 'design-system/assets/img/shared/empty-address-book-dark.svg';
import noResultsImgLight from 'design-system/assets/img/shared/no-result-search.svg';
import noResultsImgDark from 'design-system/assets/img/shared/no-result-search-dark.svg';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import { IllustrationPlaceholder } from '../../illustration';
import { InlineLinkButton } from '../../../components';

export enum EmptyType {
    All,
    Search,
    AllGroups,
}

interface Props {
    type: EmptyType | undefined;
    onClearSearch: (event: MouseEvent) => void;
    onImport: () => void;
    onCreate: () => void;
}

const ContactsWidgetPlaceholder = ({ type, onClearSearch, onImport, onCreate }: Props) => {
    let imgUrl: string;
    let actions: ReactNode;

    switch (type) {
        case EmptyType.AllGroups: {
            imgUrl = getLightOrDark(noContactsImgLight, noContactsImgDark);
            actions = (
                <div className="flex flex-column">
                    <p className="m0">{c('Actions message').t`You don't have any groups.`}</p>
                    <p className="m0">
                        <InlineLinkButton key="add-contact" onClick={onCreate}>{c('Action')
                            .t`Add group`}</InlineLinkButton>
                    </p>
                </div>
            );
            break;
        }
        case EmptyType.Search: {
            imgUrl = getLightOrDark(noResultsImgLight, noResultsImgDark);
            actions = (
                <div className="flex flex-column">
                    <p className="m0">{c('Actions message').t`No results found.`}</p>
                    <p className="m0">{c('Actions message').jt`Please try another search term.`}</p>
                    <p className="m0">
                        <InlineLinkButton onClick={onClearSearch}>{c('Action').t`Clear query`}</InlineLinkButton>
                    </p>
                </div>
            );
            break;
        }
        case EmptyType.All:
        default: {
            imgUrl = getLightOrDark(noContactsImgLight, noContactsImgDark);
            const addContact = (
                <InlineLinkButton key="add-contact" onClick={onCreate}>{c('Action').t`Add contact`}</InlineLinkButton>
            );
            const importContact = (
                <InlineLinkButton key="import" onClick={onImport}>
                    {c('Action').t`import`}
                </InlineLinkButton>
            );
            actions = (
                <div className="flex flex-column">
                    <p className="m0">{c('Actions message').t`You don't have any contacts.`}</p>
                    <p className="m0">{c('Actions message').jt`${addContact} or ${importContact}.`}</p>
                </div>
            );
        }
    }

    return (
        <div className="p2 text-center w100">
            <IllustrationPlaceholder illustrationClassName="w40" url={imgUrl}>
                <div className="flex flex-align-items-center">{actions}</div>
            </IllustrationPlaceholder>
        </div>
    );
};

export default ContactsWidgetPlaceholder;
