import { useEffect, useMemo, useState } from 'react';
import { OpenPGPKey, getKeys } from 'pmcrypto';
import { describe } from 'proton-shared/lib/keys/keysAlgorithm';
import { OrganizationKey } from '../../hooks/useGetOrganizationKeyRaw';

const useDisplayOrganizationKey = (organizationKey?: OrganizationKey) => {
    const [parsedKey, setParsedKey] = useState<OpenPGPKey>();

    useEffect(() => {
        (async () => {
            if (!organizationKey) {
                setParsedKey(undefined);
                return;
            }
            if (organizationKey.privateKey) {
                setParsedKey(organizationKey.privateKey);
                return;
            }
            const [key] = await getKeys(organizationKey.Key.PrivateKey).catch(() => []);
            setParsedKey(key);
        })();
    }, [organizationKey]);

    return useMemo(() => {
        const algorithmInfo = parsedKey?.getAlgorithmInfo() ?? { algorithm: '' };
        const fingerprint = parsedKey?.getFingerprint() ?? '';
        const isDecrypted = parsedKey?.isDecrypted() ?? false;
        return {
            // @ts-ignore
            algorithm: describe(algorithmInfo),
            fingerprint,
            isDecrypted
        };
    }, [parsedKey]);
};

export default useDisplayOrganizationKey;
