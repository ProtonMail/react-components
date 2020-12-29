import { ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';

import useContactEmails from './useContactEmails';

const compareContactEmailByName = (a: ContactEmail, b: ContactEmail) => {
    if (a.Name > b.Name) {
        return 1;
    }

    if (a.Name < b.Name) {
        return -1;
    }

    return 0;
};

const useContactEmailsSortedByName = () => {
    const [contactEmails = [], loading] = useContactEmails();
    return [[...contactEmails].sort(compareContactEmailByName), loading] as const;
};

export default useContactEmailsSortedByName;
