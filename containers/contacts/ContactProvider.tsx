import React, { useLayoutEffect, ReactNode } from 'react';
import createCache from 'proton-shared/lib/helpers/cache';
import createLRU from 'proton-shared/lib/helpers/lru';
import { EVENT_ACTIONS } from 'proton-shared/lib/constants';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { useInstance, useEventManager } from '../../hooks';
import ContactProviderContext from './ContactProviderContext';

interface Props {
    children: ReactNode;
}

/**
 * The purpose of this provider is to synchronize individual contact fetches with updates from the event manager,
 * and to have a separate LRU cache for it.
 */
const ContactProvider = ({ children }: Props) => {
    const { subscribe } = useEventManager();
    const cache = useInstance(() => {
        return createCache<string, Contact>(createLRU({ max: 10 }));
    });

    useLayoutEffect(() => {
        return subscribe(({ Contacts }: any) => {
            if (!Array.isArray(Contacts)) {
                return;
            }
            for (const { ID, Action, Contact } of Contacts) {
                // Ignore updates for non-fetched contacts.
                if (!cache.has(ID)) {
                    continue;
                }
                if (Action === EVENT_ACTIONS.DELETE) {
                    cache.delete(ID);
                }
                if (Action === EVENT_ACTIONS.UPDATE) {
                    // The contact is always received in full, so we can ignore if the contact would be currently fetching (to merge the old data)
                    cache.set(ID, Contact);
                }
            }
        });
    }, []);

    return <ContactProviderContext.Provider value={cache}>{children}</ContactProviderContext.Provider>;
};

export default ContactProvider;
