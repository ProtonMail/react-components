import React, { useEffect } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import {
    activateMemberAddressKeys,
    getAddressesWithKeysToActivate,
    generateAllPrivateMemberKeys,
    getAddressesWithKeysToGenerate,
} from 'proton-shared/lib/keys';
import { traceError } from 'proton-shared/lib/helpers/sentry';
import { createKeyTransparencyVerifier } from 'proton-shared/lib/kt/createKeyTransparencyVerifier';

import {
    useAuthentication,
    useEventManager,
    useGetAddresses,
    useGetAddressKeys,
    useGetUser,
    useGetUserKeys,
} from '../../hooks';

import useApi from '../../hooks/useApi';
import useKeyTransparency from '../kt/useKeyTransparency';

interface Props {
    hasPrivateMemberKeyGeneration?: boolean;
    hasReadableMemberKeyActivation?: boolean;
}

const KeyBackgroundManager = ({
    hasPrivateMemberKeyGeneration = false,
    hasReadableMemberKeyActivation = false,
}: Props) => {
    const getUser = useGetUser();
    const getUserKeys = useGetUserKeys();
    const getAddresses = useGetAddresses();
    const getAddressKeys = useGetAddressKeys();
    const authentication = useAuthentication();
    const { call } = useEventManager();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const keyTransparencyState = useKeyTransparency();

    useEffect(() => {
        const run = async () => {
            const [user, userKeys, addresses] = await Promise.all([getUser(), getUserKeys(), getAddresses()]);
            const keyPassword = authentication.getPassword();
            const keyTransparencyVerifier = createKeyTransparencyVerifier({ api: silentApi, keyTransparencyState });

            const addressesWithKeysToActivate = hasReadableMemberKeyActivation
                ? getAddressesWithKeysToActivate(user, addresses)
                : [];
            if (addressesWithKeysToActivate.length) {
                Promise.all(
                    addressesWithKeysToActivate.map(async (address) => {
                        const addressKeys = await getAddressKeys(address.ID);
                        return activateMemberAddressKeys({
                            address,
                            addressKeys,
                            keyPassword,
                            api: silentApi,
                            keyTransparencyVerifier: keyTransparencyVerifier.verify,
                        });
                    })
                )
                    .then(async () => {
                        await keyTransparencyVerifier.commit(userKeys);
                        call();
                    })
                    .catch(traceError);
            }

            const addressesWithKeysToGenerate = hasPrivateMemberKeyGeneration
                ? getAddressesWithKeysToGenerate(user, addresses)
                : [];
            if (addressesWithKeysToGenerate.length) {
                generateAllPrivateMemberKeys({
                    addressesToGenerate: addressesWithKeysToGenerate,
                    userKeys,
                    addresses,
                    keyPassword,
                    api: silentApi,
                    keyTransparencyVerifier: keyTransparencyVerifier.verify,
                })
                    .then(async () => {
                        await keyTransparencyVerifier.commit(userKeys);
                        call();
                    })
                    .catch(traceError);
            }
        };
        run().catch(noop);
    }, []);

    return <>{null}</>;
};

export default KeyBackgroundManager;
