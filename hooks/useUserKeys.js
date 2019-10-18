import { usePromiseResult, useAuthentication } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';

import {
    decryptKeyWithFormat,
    decryptPrivateKeyArmored,
    getUserKeyPassword
} from 'proton-shared/lib/keys/keys';

const useUserKeys = (User) => {
    const authentication = useAuthentication();

    return usePromiseResult(async () => {
        const { OrganizationPrivateKey, Keys } = User;
        const keyPassword = authentication.getPassword();

        // Case for admins logged in to non-private members.
        const organizationKey = OrganizationPrivateKey
            ? await decryptPrivateKeyArmored(OrganizationPrivateKey, keyPassword).catch(noop)
            : undefined;

        return Promise.all(
            Keys.map(async (Key) => {
                return decryptKeyWithFormat(
                    Key,
                    await getUserKeyPassword(Key, { organizationKey, keyPassword })
                );
            })
        );
    }, [User]);
};

export default useUserKeys;
