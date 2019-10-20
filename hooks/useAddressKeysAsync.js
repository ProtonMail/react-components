import { useCallback } from 'react';
import {
    decryptKeyWithFormat,
    decryptPrivateKeyArmored,
    getAddressKeyPassword,
    splitKeys
} from 'proton-shared/lib/keys/keys';
import { noop } from 'proton-shared/lib/helpers/function';
import useUserAsync from './useUserAsync';
import useAuthentication from '../containers/authentication/useAuthentication';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';
import useAddressesAsync from './useAddressesAsync';
import useUserKeysAsync from './useUserKeysAsync';

const useAddressKeysAsync = () => {
    const cache = useCache();
    const authentication = useAuthentication();
    const getUser = useUserAsync();
    const getAddresses = useAddressesAsync();
    const getUserKeys = useUserKeysAsync();

    const miss = useCallback(
        async (addressID) => {
            const [{ OrganizationPrivateKey }, Addresses, userKeys] = await Promise.all([
                getUser(),
                getAddresses(),
                getUserKeys()
            ]);

            const Address = Addresses.find(({ ID: AddressID }) => AddressID === addressID);
            if (!Address) {
                return [];
            }

            const keyPassword = authentication.getPassword();

            const organizationKey = OrganizationPrivateKey
                ? await decryptPrivateKeyArmored(OrganizationPrivateKey, keyPassword).catch(noop)
                : undefined;

            const { privateKeys, publicKeys } = splitKeys(userKeys);
            return Promise.all(
                Address.Keys.map(async (Key) => {
                    return decryptKeyWithFormat(
                        Key,
                        await getAddressKeyPassword(Key, { organizationKey, privateKeys, publicKeys, keyPassword })
                    );
                })
            );
        },
        [getUser, getAddresses, getUserKeys]
    );

    if (!cache.has('addressKeys')) {
        cache.set('addressKeys', new Map());
    }
    const addressKeyCache = cache.get('addressKeys');

    return useCachedModelAsync(addressKeyCache, miss);
};

export default useAddressKeysAsync;
