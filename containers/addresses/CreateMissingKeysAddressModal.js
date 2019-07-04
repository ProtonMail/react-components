import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    useApi,
    useAuthenticationStore,
    useNotifications,
    useEventManager,
    useLoading,
    Badge,
    LoaderIcon,
    FormModal,
    Table,
    TableHeader,
    TableBody,
    TableRow
} from 'react-components';
import { DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS } from 'proton-shared/lib/constants';

import SelectEncryption from '../keys/addKey/SelectEncryption';
import { createMemberAddressKeys, generateMemberAddressKey } from '../members/actionHelper';
import { createKeyHelper, generateAddressKey } from '../keys/shared/actionHelper';
import { prepareMemberKeys } from 'proton-shared/lib/keys/keys';

const STATUS = {
    QUEUED: 0,
    DONE: 1,
    FAILURE: 2,
    LOADING: 3
};

const Status = ({ type, tooltip }) => {
    if (type === STATUS.QUEUED) {
        return <Badge type="default">{c('Info').t`Queued`}</Badge>;
    }

    if (type === STATUS.DONE) {
        return <Badge type="success">{c('Info').t`Done`}</Badge>;
    }

    if (type === STATUS.FAILURE) {
        return <Badge type="error" tooltip={tooltip}>{c('Error').t`Error`}</Badge>;
    }

    if (type === STATUS.LOADING) {
        return <LoaderIcon />;
    }
    return null;
};

Status.propTypes = {
    type: PropTypes.number,
    tooltip: PropTypes.string
};

const updateAddress = (oldAddresses, address, status) => {
    return oldAddresses.map((oldAddress) => {
        if (oldAddress.ID === address.ID) {
            return { ...address, status };
        }
        return oldAddress;
    });
};

const CreateMissingKeysAddressModal = ({ onClose, member, addresses, organizationKey, ...rest }) => {
    const api = useApi();
    const authenticationStore = useAuthenticationStore();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const doneRef = useRef(false);
    const [formattedAddresses, setFormattedAddresses] = useState(() =>
        addresses.map((address) => ({
            ...address,
            status: {
                type: STATUS.QUEUED
            }
        }))
    );

    const [encryptionType, setEncryptionType] = useState(DEFAULT_ENCRYPTION_CONFIG);

    const processMember = async () => {
        const encryptionConfig = ENCRYPTION_CONFIGS[encryptionType];

        const preparedMemberKeys = await prepareMemberKeys(member.Keys, organizationKey);
        const { privateKey: primaryMemberKey } = preparedMemberKeys.find(({ Key: { Primary } }) => Primary === 1) || {};

        if (!primaryMemberKey) {
            return createNotification({ text: c('Error').t`Member keys are not set up.` });
        }

        await Promise.all(
            addresses.map(async (address) => {
                try {
                    setFormattedAddresses((oldState) => updateAddress(oldState, address, { type: STATUS.LOADING }));

                    await createMemberAddressKeys({
                        api,
                        Member: member,
                        Address: address,
                        keys: [], // Assume no keys exists for this address since we are in this modal.
                        ...(await generateMemberAddressKey({
                            email: address.Email,
                            primaryKey: primaryMemberKey,
                            organizationKey,
                            encryptionConfig
                        }))
                    });

                    setFormattedAddresses((oldState) => updateAddress(oldState, address, { type: STATUS.DONE }));
                } catch (e) {
                    setFormattedAddresses((oldState) =>
                        updateAddress(oldState, address, { type: STATUS.FAILURE, tooltip: e.message })
                    );
                }
            })
        );

        await call();
    };

    const processSelf = async () => {
        const encryptionConfig = ENCRYPTION_CONFIGS[encryptionType];

        await Promise.all(
            addresses.map(async (address) => {
                try {
                    setFormattedAddresses((oldState) => updateAddress(oldState, address, { type: STATUS.LOADING }));

                    const { privateKey, privateKeyArmored } = await generateAddressKey({
                        email: address.Email,
                        passphrase: authenticationStore.getPassword(),
                        encryptionConfig
                    });

                    await createKeyHelper({
                        api,
                        privateKey,
                        privateKeyArmored,
                        Address: address,
                        keys: []
                    });

                    setFormattedAddresses((oldState) => updateAddress(oldState, address, { type: STATUS.DONE }));
                } catch (e) {
                    setFormattedAddresses((oldState) =>
                        updateAddress(oldState, address, { type: STATUS.FAILURE, tooltip: e.message })
                    );
                }
            })
        );

        await call();
    };

    const handleSubmit = () => {
        if (doneRef.current) {
            return onClose();
        }
        doneRef.current = true;

        withLoading(member.Self ? processSelf() : processMember());
    };

    return (
        <FormModal
            title={c('Title').t`Generate missing keys`}
            close={c('Action').t`Close`}
            submit={c('Action').t`Submit`}
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            {...rest}
        >
            <SelectEncryption encryptionType={encryptionType} setEncryptionType={setEncryptionType} />
            <Table>
                <TableHeader
                    cells={[c('Header for addresses table').t`Address`, c('Header for addresses table').t`Status`]}
                />
                <TableBody colSpan={2}>
                    {formattedAddresses.map((address) => (
                        <TableRow key={address.ID} cells={[address.Email, <Status key={0} {...address.status} />]} />
                    ))}
                </TableBody>
            </Table>
        </FormModal>
    );
};

CreateMissingKeysAddressModal.propTypes = {
    onClose: PropTypes.func,
    organizationKey: PropTypes.object,
    member: PropTypes.object.isRequired,
    addresses: PropTypes.array.isRequired
};

export default CreateMissingKeysAddressModal;
