import React, { useEffect, useState } from 'react';
import { ktSelfAudit, EXP_EPOCH_INTERVAL } from 'key-transparency-web-client';
import { KeyTransparencyState } from 'proton-shared/lib/interfaces';
import Context, { initialState } from './context';
import { useGetAddresses, useGetAddressKeys, useGetUserKeys, useApi } from '../../hooks';

interface Props {
    children: React.ReactNode;
}

const KeyTransparencyManager = ({ children }: Props) => {
    const [state, setState] = useState<KeyTransparencyState>(initialState);
    const getAddressKeys = useGetAddressKeys();
    const getAddresses = useGetAddresses();
    const getUserKeys = useGetUserKeys();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });

    useEffect(() => {
        const run = async () => {
            // Run starts
            setState((state) => {
                return {
                    ...state,
                    isRunning: !state.isRunning,
                };
            });

            // Prepare keys
            const userKeys = await getUserKeys();
            const addresses = await getAddresses();
            const addressesWithKeys = await Promise.all(
                addresses.map(async (address) => {
                    const decryptedKeys = await getAddressKeys(address.ID);
                    const Keys = address.Keys.map((key) => {
                        const decryptedEquivalent = decryptedKeys.find((decryptedKey) => {
                            return key.ID === decryptedKey.ID;
                        })!;
                        if (!decryptedEquivalent || !decryptedEquivalent.privateKey) {
                            return key;
                        }
                        return {
                            ...key,
                            PublicKey: decryptedEquivalent.publicKey.armor(),
                            PrivateKey: decryptedEquivalent.privateKey.armor(),
                        };
                    });
                    return {
                        ...address,
                        Keys,
                    };
                })
            );
            const userPrivateKeys = userKeys.map(({ privateKey }) => {
                return {
                    privateKey,
                };
            });

            // Run self-audit
            const ktSelfAuditResult = await ktSelfAudit([normalApi, silentApi], addressesWithKeys, userPrivateKeys);

            // Run ends
            setState((state) => {
                return {
                    ktSelfAuditResult,
                    lastSelfAudit: Date.now(),
                    isRunning: !state.isRunning,
                };
            });

            // Repeat every expectedEpochInterval (4h)
            setTimeout(() => {
                run();
            }, EXP_EPOCH_INTERVAL);
        };

        run();
    }, []);

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

export default KeyTransparencyManager;
