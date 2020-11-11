import { useCallback } from 'react';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { MEMBER_PRIVATE } from 'proton-shared/lib/constants';
import { getDecryptedAddressKeys } from 'proton-shared/lib/keys/getDecryptedAddressKeys';

import useAuthentication from './useAuthentication';
import useCache from './useCache';
import { useGetAddresses } from './useAddresses';
import { useGetUserKeys } from './useUserKeys';
import { getPromiseValue } from './useCachedModelResult';
import { useGetUser } from './useUser';

export const CACHE_KEY = 'ADDRESS_KEYS';

export const useGetAddressKeysRaw = (): ((id: string) => Promise<CachedKey[]>) => {
    const authentication = useAuthentication();
    const getUser = useGetUser();
    const getAddresses = useGetAddresses();
    const getUserKeys = useGetUserKeys();

    return useCallback(
        async (addressID) => {
            const [{ OrganizationPrivateKey, Private }, Addresses, userKeys] = await Promise.all([
                getUser(),
                getAddresses(),
                getUserKeys(),
            ]);
            const Address = Addresses.find(({ ID: AddressID }) => AddressID === addressID);
            if (!Address) {
                return [];
            }
            return getDecryptedAddressKeys({
                addressKeys: Address.Keys,
                userKeys,
                OrganizationPrivateKey,
                isReadableMember: Private === MEMBER_PRIVATE.READABLE,
                keyPassword: authentication.getPassword(),
            });
        },
        [getUser, getAddresses, getUserKeys]
    );
};

export const useGetAddressKeys = (): ((id: string) => Promise<CachedKey[]>) => {
    const cache = useCache();
    const miss = useGetAddressKeysRaw();

    return useCallback(
        (key) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            return getPromiseValue(subCache, key, miss);
        },
        [cache, miss]
    );
};
