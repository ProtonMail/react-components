import { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { getContact } from 'proton-shared/lib/api/contacts';
import { Contact } from 'proton-shared/lib/interfaces/contacts/Contact';
import { noop } from 'proton-shared/lib/helpers/function';
import { useApi } from '../../hooks';
import ContactProviderContext, { ContactCache } from './ContactProviderContext';

const useContact = (contactID: string, onDelete: () => void = noop): [Contact | undefined, boolean] => {
    const cache = useContext<ContactCache>(ContactProviderContext);
    const api = useApi();

    const [contact, setContact] = useState(cache.get(contactID));
    const [loading, setLoading] = useState(cache.has(contactID));

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { Contact } = await api<{ Contact: Contact }>(getContact(contactID));
            cache.set(contactID, Contact);
            setLoading(false);
        };

        if (cache.has(contactID)) {
            setContact(cache.get(contactID));
        } else {
            void load();
        }
    }, [contactID]);

    useLayoutEffect(
        () =>
            cache.subscribe((changedMessageID: string) => {
                if (changedMessageID === contactID) {
                    if (cache.has(contactID)) {
                        setContact(cache.get(contactID));
                    } else {
                        onDelete();
                    }
                }
            }),
        []
    );

    return [contact, loading];
};

export default useContact;
