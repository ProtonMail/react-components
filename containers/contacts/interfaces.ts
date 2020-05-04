import { Contact } from 'proton-shared/lib/interfaces/contacts/Contact';

export interface ContactFormatted extends Contact {
    emails: string[];
    isChecked: boolean;
}
