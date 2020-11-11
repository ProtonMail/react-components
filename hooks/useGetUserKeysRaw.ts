import { useCallback } from 'react';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { getDecryptedUserKeys } from 'proton-shared/lib/keys/getDecryptedUserKeys';
import useAuthentication from './useAuthentication';
import { useGetUser } from './useUser';

export const useGetUserKeysRaw = (): (() => Promise<CachedKey[]>) => {
    const authentication = useAuthentication();
    const getUser = useGetUser();

    return useCallback(async () => {
        const { OrganizationPrivateKey, Keys = [] } = await getUser();
        return getDecryptedUserKeys({
            userKeys: Keys,
            OrganizationPrivateKey,
            keyPassword: authentication.getPassword(),
        });
    }, [getUser]);
};
