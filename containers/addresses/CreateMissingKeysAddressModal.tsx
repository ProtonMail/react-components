import React, { useState } from 'react';
import { c } from 'ttag';
import {
    useApi,
    useAuthentication,
    useNotifications,
    useEventManager,
    useLoading,
    FormModal,
    Alert,
    Table,
    TableHeader,
    TableBody,
    TableRow
} from '../../index';
import { DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS, ENCRYPTION_TYPES } from 'proton-shared/lib/constants';
import { generateMemberAddressKey } from 'proton-shared/lib/keys/organizationKeys';
import { decryptMemberToken } from 'proton-shared/lib/keys/memberToken';
import { generateAddressKey } from 'proton-shared/lib/keys/keys';
import { noop } from 'proton-shared/lib/helpers/function';

import SelectEncryption from '../keys/addKey/SelectEncryption';
import MissingKeysStatus, { STATUS } from './MissingKeysStatus';
import { createMemberAddressKeys } from '../members/actionHelper';
import createKeyHelper from '../keys/addKey/createKeyHelper';
import { decryptPrivateKey, OpenPGPKey } from 'pmcrypto';
import { EncryptionConfig, Address, Member } from 'proton-shared/lib/interfaces';

interface AddressWithStatus extends Address {
    status: {
        type: STATUS;
        tooltip?: string;
    };
}
const updateAddress = (oldAddresses: AddressWithStatus[], ID: string, diff: Partial<AddressWithStatus>) => {
    return oldAddresses.map((oldAddress) => {
        if (oldAddress.ID === ID) {
            return { ...oldAddress, ...diff };
        }
        return oldAddress;
    });
};

interface Props {
    onClose?: () => void;
    member: Member;
    addresses: Address[];
    organizationKey: OpenPGPKey;
}
const CreateMissingKeysAddressModal = ({ onClose, member, addresses, organizationKey, ...rest }: Props) => {
    const api = useApi();
    const authentication = useAuthentication();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const [step, setStep] = useState('init');
    const [formattedAddresses, setFormattedAddresses] = useState<AddressWithStatus[]>(() =>
        addresses.map((address) => ({
            ...address,
            status: {
                type: STATUS.QUEUED
            }
        }))
    );

    const [encryptionType, setEncryptionType] = useState<ENCRYPTION_TYPES>(DEFAULT_ENCRYPTION_CONFIG);

    const processMember = async () => {
        const encryptionConfig = ENCRYPTION_CONFIGS[encryptionType];

        const PrimaryKey = member.Keys.find(({ Primary }) => Primary === 1);

        if (!PrimaryKey) {
            return createNotification({ text: c('Error').t`Member keys are not set up.` });
        }
        if (!PrimaryKey.Token) {
            return createNotification({ text: c('Error').t`Member token invalid.` });
        }

        const decryptedToken = await decryptMemberToken(PrimaryKey.Token, organizationKey);
        const primaryMemberKey = await decryptPrivateKey(PrimaryKey.PrivateKey, decryptedToken);

        await Promise.all(
            addresses.map(async (address) => {
                try {
                    setFormattedAddresses((oldState) => {
                        return updateAddress(oldState, address.ID, { status: { type: STATUS.LOADING } });
                    });

                    const { privateKey, ...rest } = await generateMemberAddressKey({
                        email: address.Email,
                        primaryKey: primaryMemberKey,
                        organizationKey,
                        encryptionConfig
                    });

                    await createMemberAddressKeys({
                        api,
                        Member: member,
                        Address: address,
                        keys: [], // Assume no keys exists for this address since we are in this modal.
                        signingKey: privateKey,
                        privateKey,
                        ...rest
                    });

                    setFormattedAddresses((oldState) => {
                        return updateAddress(oldState, address.ID, { status: { type: STATUS.DONE } });
                    });
                } catch (e) {
                    setFormattedAddresses((oldState) =>
                        updateAddress(oldState, address.ID, { status: { type: STATUS.FAILURE, tooltip: e.message } })
                    );
                }
            })
        );

        await call();
    };

    const processSelf = async () => {
        const encryptionConfig = ENCRYPTION_CONFIGS[encryptionType] as EncryptionConfig;

        await Promise.all(
            addresses.map(async (address) => {
                try {
                    setFormattedAddresses((oldState) => {
                        return updateAddress(oldState, address.ID, { status: { type: STATUS.LOADING } });
                    });

                    const { privateKey, privateKeyArmored } = await generateAddressKey({
                        email: address.Email,
                        passphrase: authentication.getPassword(),
                        encryptionConfig
                    });

                    await createKeyHelper({
                        api,
                        privateKeyArmored,
                        fingerprint: privateKey.getFingerprint(),
                        Address: address,
                        keys: [],
                        signingKey: privateKey
                    });

                    setFormattedAddresses((oldState) => {
                        return updateAddress(oldState, address.ID, { status: { type: STATUS.DONE } });
                    });
                } catch (e) {
                    setFormattedAddresses((oldState) =>
                        updateAddress(oldState, address.ID, { status: { type: STATUS.FAILURE, tooltip: e.message } })
                    );
                }
            })
        );

        await call();
    };

    const handleSubmit = () => {
        if (step === 'init') {
            withLoading(
                (member.Self ? processSelf() : processMember())
                    .then(() => setStep('done'))
                    .catch(() => setStep('error'))
            );
        } else {
            onClose?.();
        }
    };

    const submitText = (() => {
        if (step === 'done') {
            return c('Action').t`Done`;
        }
        if (step === 'error') {
            return c('Action').t`Close`;
        }
        return c('Action').t`Submit`;
    })();

    return (
        <FormModal
            title={c('Title').t`Generate missing keys`}
            close={c('Action').t`Close`}
            submit={submitText}
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            {...rest}
        >
            <Alert>{c('Info')
                .t`Before you can start sending and receiving emails from your new addresses you need to create encryption keys for them.`}</Alert>
            <SelectEncryption
                encryptionType={encryptionType}
                setEncryptionType={step === 'init' ? setEncryptionType : noop}
            />
            <Table>
                <TableHeader
                    cells={[c('Header for addresses table').t`Address`, c('Header for addresses table').t`Status`]}
                />
                <TableBody colSpan={2}>
                    {formattedAddresses.map((address) => (
                        <TableRow
                            key={address.ID}
                            cells={[address.Email, <MissingKeysStatus key={0} {...address.status} />]}
                        />
                    ))}
                </TableBody>
            </Table>
        </FormModal>
    );
};

export default CreateMissingKeysAddressModal;
