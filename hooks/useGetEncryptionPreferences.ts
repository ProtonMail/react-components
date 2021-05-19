import getPublicKeysVcardHelper from 'proton-shared/lib/api/helpers/getPublicKeysVcardHelper';
import { DOMAIN_STATE, MINUTE, RECIPIENT_TYPES } from 'proton-shared/lib/constants';
import { canonizeEmail, canonizeInternalEmail } from 'proton-shared/lib/helpers/email';
import { GetEncryptionPreferences } from 'proton-shared/lib/interfaces/hooks/GetEncryptionPreferences';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { getContactPublicKeyModel } from 'proton-shared/lib/keys/publicKeys';
import extractEncryptionPreferences from 'proton-shared/lib/mail/encryptionPreferences';
import { useCallback } from 'react';
import { hasProtonDomain } from 'proton-shared/lib/helpers/string';
import { useGetAddresses } from './useAddresses';
import useApi from './useApi';
import useCache from './useCache';
import { getPromiseValue } from './useCachedModelResult';
import { useGetAddressKeys } from './useGetAddressKeys';
import useGetPublicKeys from './useGetPublicKeys';
import { useGetMailSettings } from './useMailSettings';
import { useGetUserKeys } from './useUserKeys';
import { useGetDomains } from './useDomains';

export const CACHE_KEY = 'ENCRYPTION_PREFERENCES';

const DEFAULT_LIFETIME = 5 * MINUTE;

/**
 * Given an email address and the user mail settings, return the encryption preferences for sending to that email.
 * The logic for how those preferences are determined is laid out in the
 * Confluence document 'Encryption preferences for outgoing email'
 */
const useGetEncryptionPreferences = () => {
    const api = useApi();
    const cache = useCache();
    const getAddresses = useGetAddresses();
    const getUserKeys = useGetUserKeys();
    const getAddressKeys = useGetAddressKeys();
    const getPublicKeys = useGetPublicKeys();
    const getMailSettings = useGetMailSettings();
    const getDomains = useGetDomains();

    const getSelfAddress = async (emailAddress: string) => {
        const [addresses, domains] = await Promise.all([getAddresses(), getDomains()]);
        const canonicalEmail = canonizeInternalEmail(emailAddress);
        // List active domains
        const domainNames = domains
            .filter((domain) => domain.State === DOMAIN_STATE.DOMAIN_STATE_ACTIVE)
            .map((domain) => domain.DomainName);
        const customDomainRegex = new RegExp(`@(${domainNames.join('|')})$`, 'i');

        return (
            addresses
                // Ignore addresses on inactive domains, they can be hosted somewhere else
                .filter(({ Email }) => hasProtonDomain(Email) || customDomainRegex.test(Email))
                .find(({ Email }) => canonizeInternalEmail(Email) === canonicalEmail)
        );
    };

    const getEncryptionPreferences = useCallback<GetEncryptionPreferences>(
        async (emailAddress, lifetime, contactEmailsMap) => {
            const [selfAddress, mailSettings] = await Promise.all([getSelfAddress(emailAddress), getMailSettings()]);
            let selfSend;
            let apiKeysConfig;
            let pinnedKeysConfig;
            if (selfAddress) {
                // we do not trust the public keys in ownAddress (they will be deprecated in the API response soon anyway)
                const selfPublicKey = (await getAddressKeys(selfAddress.ID))[0]?.publicKey;
                selfSend = { address: selfAddress, publicKey: selfPublicKey };
                // For own addresses, we use the decrypted keys in selfSend and do not fetch any data from the API
                apiKeysConfig = { Keys: [], publicKeys: [], RecipientType: RECIPIENT_TYPES.TYPE_INTERNAL };
                pinnedKeysConfig = { pinnedKeys: [], isContact: false };
            } else {
                const { publicKeys } = splitKeys(await getUserKeys());
                apiKeysConfig = await getPublicKeys(emailAddress, lifetime);
                const isInternal = apiKeysConfig.RecipientType === RECIPIENT_TYPES.TYPE_INTERNAL;
                pinnedKeysConfig = await getPublicKeysVcardHelper(
                    api,
                    emailAddress,
                    publicKeys,
                    isInternal,
                    contactEmailsMap
                );
            }
            const publicKeyModel = await getContactPublicKeyModel({
                emailAddress,
                apiKeysConfig,
                pinnedKeysConfig,
            });
            return extractEncryptionPreferences(publicKeyModel, mailSettings, selfSend);
        },
        [api, getAddressKeys, getAddresses, getPublicKeys, getMailSettings]
    );

    return useCallback<GetEncryptionPreferences>(
        (email, lifetime = DEFAULT_LIFETIME, contactEmailsMap) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            // By normalizing email here, we consider that it could not exists different encryption preferences
            // For 2 addresses identical but for the cases.
            // If a provider does different one day, this would have to evolve.
            const canonicalEmail = canonizeEmail(email);
            const miss = () => getEncryptionPreferences(canonicalEmail, lifetime, contactEmailsMap);
            return getPromiseValue(subCache, canonicalEmail, miss, lifetime);
        },
        [cache, getEncryptionPreferences]
    );
};

export default useGetEncryptionPreferences;
