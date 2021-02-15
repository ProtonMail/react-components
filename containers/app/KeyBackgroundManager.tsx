import React, { useEffect } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import {
    activateMemberAddressKeys,
    getAddressesWithKeysToActivate,
    generateAllPrivateMemberKeys,
    getAddressesWithKeysToGenerate,
} from 'proton-shared/lib/keys';
import { traceError } from 'proton-shared/lib/helpers/sentry';
import { ktSaveToLS } from 'key-transparency-web-client';

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
                            keyTransparencyState,
                        });
                    })
                )
                    .then((ktMessageObjects) => {
                        for (let i = 0; i < ktMessageObjects.length; i++) {
                            const ktMessageObject = ktMessageObjects[i];
                            if (ktMessageObject) {
                                ktSaveToLS(ktMessageObject, userKeys, normalApi);
                            }
                        }
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
                    keyTransparencyState,
                })
                    .then((triplets) => {
                        triplets.map((triplet) => {
                            const [, , ktMessageObject] = triplet;
                            return ktSaveToLS(ktMessageObject, userKeys, normalApi);
                        });
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
