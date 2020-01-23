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
} from '../../../index';
import { DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS, ENCRYPTION_TYPES } from 'proton-shared/lib/constants';
import { decryptMemberToken } from 'proton-shared/lib/keys/memberToken';
import { noop } from 'proton-shared/lib/helpers/function';

import SelectEncryption from '../../keys/addKey/SelectEncryption';
import MissingKeysStatus from './MissingKeysStatus';
import { decryptPrivateKey, OpenPGPKey } from 'pmcrypto';
import { Address, Member } from 'proton-shared/lib/interfaces';
import { AddressWithStatus, Status } from './interface';
import missingKeysSelfProcess from './missingKeysSelfProcess';
import missingKeysMemberProcess from './missingKeysMemberProcess';

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
                type: Status.QUEUED
            }
        }))
    );

    const [encryptionType, setEncryptionType] = useState<ENCRYPTION_TYPES>(DEFAULT_ENCRYPTION_CONFIG);

    const processMember = async () => {
        const PrimaryKey = member.Keys.find(({ Primary }) => Primary === 1);

        if (!PrimaryKey) {
            return createNotification({ text: c('Error').t`Member keys are not set up.` });
        }
        if (!PrimaryKey.Token) {
            return createNotification({ text: c('Error').t`Member token invalid.` });
        }

        const decryptedToken = await decryptMemberToken(PrimaryKey.Token, organizationKey);
        const primaryMemberKey = await decryptPrivateKey(PrimaryKey.PrivateKey, decryptedToken);

        await missingKeysMemberProcess({
            api,
            encryptionConfig: ENCRYPTION_CONFIGS[encryptionType],
            addresses,
            member,
            setFormattedAddresses,
            primaryMemberKey,
            organizationKey
        });
        await call();
    };

    const processSelf = async () => {
        await missingKeysSelfProcess({
            api,
            addresses,
            password: authentication.getPassword(),
            encryptionConfig: ENCRYPTION_CONFIGS[encryptionType],
            setFormattedAddresses
        });
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
