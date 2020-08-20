import { useEffect } from 'react';
import { Address } from 'proton-shared/lib/interfaces';

import { useGetAddresses } from './useAddresses';
import { useGetAddressKeys } from './useGetAddressKeys';
import { useGetUser } from './useUser';
import useApi from './useApi';
import useAuthentication from './useAuthentication';
import getKeysActionList from 'proton-shared/lib/keys/getKeysActionList';

const useMemberKeyActivation = () => {
    const getUser = useGetUser();
    const getAddresses = useGetAddresses();
    const getAddressKeys = useGetAddressKeys();
    const authentication = useAuthentication();
    const api = useApi();
    const silentApi = <T>(config: any) => api<T>({ ...config, silence: true });

    useEffect(() => {
        const run = async () => {
            const user = await getUser();
            if (user.OrganizationPrivateKey || user.Private !== 0) {
                return;
            }
            const addresses = await getAddresses();
            const addressesWithKeysToActivate = addresses.filter(({ Keys = [] }) => {
                return Keys.some(({ Activation }) => !!Activation);
            });
            if (!addressesWithKeysToActivate.length) {
                return;
            }

            const mailboxPassword = authentication.getPassword();

            const activateAddressKeys = async (address: Address) => {
                const addressKeys = await getAddressKeys(address.ID);
                let updatedKeyList = await getKeysActionList(addressKeys);

                for (const addressKey of addressKeys) {
                    const { Key: { Activation }, privateKey } = addressKey;
                    if (!Activation || !privateKey) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                    await activateKey({ key: Key, pkg: decryptedKey, mailboxPassword, address });
                    const formattedKey = await formatKey({ key: Key, pkg: decryptedKey, address });
                    keysModel.storeKeys([formattedKey]);
                }
            };

            await Promise.all(addressesWithKeysToActivate.map(activateAddressKeys));
        }
        run().catch(() => { return undefined; });
    }, []);
}

export default useMemberKeyActivation;
