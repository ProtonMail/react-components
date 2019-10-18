import {
    decryptKeyWithFormat,
    decryptPrivateKeyArmored,
    splitKeys,
    getAddressKeyPassword,
} from 'proton-shared/lib/keys/keys';
import { usePromiseResult, useAuthentication } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';

const useAddressesKeys = (user, addresses, userKeysList) => {
    const authentication = useAuthentication();

    return usePromiseResult(async () => {
        if (!Array.isArray(addresses) || !Array.isArray(userKeysList) || userKeysList.length === 0) {
            return;
        }

        const keyPassword = authentication.getPassword();

        // Case for admins logged in to non-private members.
        const { OrganizationPrivateKey } = user;
        const organizationKey = OrganizationPrivateKey
            ? await decryptPrivateKeyArmored(OrganizationPrivateKey, keyPassword).catch(noop)
            : undefined;

        const { privateKeys, publicKeys } = splitKeys(userKeysList);

        const keys = await Promise.all(
            addresses.map(({ Keys }) => {
                return Promise.all(
                    Keys.map(async (Key) => {
                        return decryptKeyWithFormat(
                            Key,
                            await getAddressKeyPassword(Key, { organizationKey, privateKeys, publicKeys, keyPassword })
                        );
                    })
                );
            })
        );

        return addresses.reduce((acc, { ID }, i) => {
            return {
                ...acc,
                [ID]: keys[i]
            };
        }, {});
    }, [addresses, userKeysList]);
};

export default useAddressesKeys;
