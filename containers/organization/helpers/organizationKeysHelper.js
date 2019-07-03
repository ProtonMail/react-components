import { encryptMessage, encryptPrivateKey, generateKey } from 'pmcrypto';
import { computeKeyPassword, generateKeySalt } from 'pm-srp';
import { decryptMemberToken } from 'proton-shared/lib/keys/keys';

export const getBackupKeyData = async ({ backupPassword, organizationKey }) => {
    const backupKeySalt = generateKeySalt();
    const backupKeyPassword = await computeKeyPassword(backupPassword, backupKeySalt);
    const backupArmoredPrivateKey = await encryptPrivateKey(organizationKey, backupKeyPassword);

    return {
        backupKeySalt,
        backupArmoredPrivateKey
    };
};

export const generateOrganizationKeys = async ({ keyPassword, backupPassword, encryptionConfig }) => {
    const { key: privateKey, privateKeyArmored } = await generateKey({
        userIds: [{ name: 'not_for_email_use@domain.tld', email: 'not_for_email_use@domain.tld' }],
        passphrase: keyPassword,
        ...encryptionConfig
    });

    await privateKey.decrypt(keyPassword);

    return {
        privateKey,
        privateKeyArmored,
        ...(await getBackupKeyData({ backupPassword, organizationKey: privateKey }))
    };
};

export const reEncryptOrganizationTokens = ({ nonPrivateMembers = [], oldOrganizationKey, newOrganizationKey }) => {
    const newOrganizationPublicKey = newOrganizationKey.toPublic();

    const getMemberTokens = ({ Keys = [], Addresses = [] }) => {
        const memberKeys = Addresses.reduce((acc, { Keys: AddressKeys }) => {
            return acc.concat(AddressKeys);
        }, Keys);

        return memberKeys.map(async ({ ID, Token, Activation }) => {
            // TODO: Check if Token || Activation is really neccessary.
            const decryptedToken = await decryptMemberToken(Token || Activation, oldOrganizationKey);
            const { data } = await encryptMessage({
                data: decryptedToken,
                privateKeys: newOrganizationKey,
                publicKeys: newOrganizationPublicKey
            });

            return { ID, Token: data };
        });
    };

    return Promise.all(nonPrivateMembers.map(getMemberTokens).flat());
};
