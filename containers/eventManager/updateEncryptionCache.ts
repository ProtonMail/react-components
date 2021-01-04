import { normalizeEmail } from 'proton-shared/lib/helpers/email';
import { getEmailsFromContact } from 'proton-shared/lib/contacts/helper';

export const updateEncryptionCache = ({ Contacts = [] }: any, encryptionPreferenceCache: Map<string, any>) => {
    for (const { Contact } of Contacts) {
        const emails = getEmailsFromContact(Contact);
        for (const email of emails) {
            encryptionPreferenceCache.delete(normalizeEmail(email));
        }
    }
};
