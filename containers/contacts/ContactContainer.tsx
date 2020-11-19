import React from 'react';
import { DecryptedKey } from 'proton-shared/lib/interfaces';
import { Contact, ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { resignCards } from 'proton-shared/lib/contacts/resign';
import { updateContact } from 'proton-shared/lib/api/contacts';
import useContact from './useContact';
import ContactView from './ContactView';
import useContactProperties from './useContactProperties';
import Loader from '../../components/loader/Loader';
import { useApi, useEventManager } from '../../hooks';

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    userKeysList: DecryptedKey[];
    ownAddresses: string[];
    isModal?: boolean;
    onDelete: () => void;
}

const ContactContainer = ({
    contactID,
    contactEmails,
    contactGroupsMap,
    ownAddresses,
    userKeysList = [],
    isModal = false,
    onDelete,
}: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const [contact, contactLoading] = useContact(contactID) as [Contact, boolean, Error];
    const [{ properties, errors, ID }, onReload] = useContactProperties({ contact, userKeysList });

    if (contactLoading || !properties || ID !== contactID) {
        return <Loader />;
    }

    const handleResign = async () => {
        const { privateKeys } = splitKeys(userKeysList);

        const contactCards = contact.Cards;
        if (!contactCards || contactLoading) {
            return;
        }

        const resignedCards = await resignCards({
            contactCards,
            privateKeys: [privateKeys[0]],
        });

        await api(updateContact(contactID, { Cards: resignedCards }));
        await call();

        onReload();
    };

    return (
        <ContactView
            properties={properties}
            contactID={contactID}
            contactEmails={contactEmails}
            contactGroupsMap={contactGroupsMap}
            ownAddresses={ownAddresses}
            userKeysList={userKeysList}
            errors={errors}
            isModal={isModal}
            onDelete={onDelete}
            onReload={onReload}
            onResign={handleResign}
        />
    );
};

export default ContactContainer;
