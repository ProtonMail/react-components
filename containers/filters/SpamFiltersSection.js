import React, { useState } from 'react';
import { c } from 'ttag';
import { Alert, SubTitle, useApi } from 'react-components';
import { getIncomingDefaults } from 'proton-shared/lib/api/incomingDefaults';
import { MAILBOX_IDENTIFIERS } from 'proton-shared/lib/constants';

import useSpamList from '../../hooks/useSpamList';
import SpamListItem from './spamlist/SpamListItem';
import SearchEmailIntoList from './spamlist/SearchEmailIntoList';

const BLACKLIST_TYPE = +MAILBOX_IDENTIFIERS.spam;
const WHITELIST_TYPE = +MAILBOX_IDENTIFIERS.inbox;

function SpamFiltersSection() {
    const api = useApi();
    const { blackList, whiteList, move, remove, search, create } = useSpamList();

    const [loader, setLoader] = useState({});

    const handleAction = (action) => (type, data) => {
        action === 'create' && create(type, data);
        action === 'remove' && remove(data);
        action === 'move' && move(type, data);
    };

    const handleSearchChange = async (Keyword) => {
        search(Keyword);
        setLoader({ white: true, black: true });
        try {
            const [
                { IncomingDefaults: WhiteIncomingDefaults = [] },
                { IncomingDefaults: BlackIncomingDefaults = [] }
            ] = await Promise.all([
                api(getIncomingDefaults({ Location: WHITELIST_TYPE, Keyword, PageSize: 100 })),
                api(getIncomingDefaults({ Location: BLACKLIST_TYPE, Keyword, PageSize: 100 }))
            ]);
            search(Keyword, WhiteIncomingDefaults.concat(BlackIncomingDefaults));
            setLoader({ white: false, black: false });
        } catch (e) {
            setLoader({ white: false, black: false });
        }
    };

    return (
        <>
            <SubTitle>{c('FilterSettings').t`Spam Filters`}</SubTitle>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/spam-filtering/">
                {c('FilterSettings')
                    .t`Sender specific spam rules can be applied here. Whitelist addresses always go to Inbox while Blacklist addresses always go to Spam. Marking a message as spam adds the address to the Blacklist. Marking a message as not spam adds it to the Whitelist.`}
            </Alert>
            <div className="mb1">
                <SearchEmailIntoList onChange={handleSearchChange} />
            </div>

            <div className="flex onmobile-flex-column">
                <SpamListItem
                    list={whiteList}
                    type="whitelist"
                    dest="blacklist"
                    loading={loader.white}
                    onAction={handleAction}
                />
                <SpamListItem
                    list={blackList}
                    type="blacklist"
                    dest="whitelist"
                    className="ml1 onmobile-ml0"
                    loading={loader.black}
                    onAction={handleAction}
                />
            </div>
        </>
    );
}

export default SpamFiltersSection;
