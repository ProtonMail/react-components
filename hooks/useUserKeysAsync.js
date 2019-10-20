import { useCallback } from 'react';
import { decryptKeyWithFormat, decryptPrivateKeyArmored, getUserKeyPassword } from 'proton-shared/lib/keys/keys';
import { noop } from 'proton-shared/lib/helpers/function';
import useUserAsync from './useUserAsync';
import useAuthentication from '../containers/authentication/useAuthentication';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';

const useUserKeysAsync = () => {
    const cache = useCache();
    const authentication = useAuthentication();
    const getUser = useUserAsync();

    const miss = useCallback(async () => {
        const { OrganizationPrivateKey, Keys } = await getUser();

        const keyPassword = authentication.getPassword();

        const organizationKey = OrganizationPrivateKey
            ? await decryptPrivateKeyArmored(OrganizationPrivateKey, keyPassword).catch(noop)
            : undefined;

        return Promise.all(
            Keys.map(async (Key) => {
                return decryptKeyWithFormat(Key, await getUserKeyPassword(Key, { organizationKey, keyPassword }));
            })
        );
    }, []);

    return useCachedModelAsync(cache, miss, 'userKeys');
};

export default useUserKeysAsync;
