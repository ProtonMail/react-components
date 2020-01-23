import { useEffect, useState } from 'react';
import { CachedKey, Address } from 'proton-shared/lib/interfaces';
import getParsedKeys from 'proton-shared/lib/keys/getParsedKeys';
import { getDisplayKey } from './getDisplayKey';
import { KeyDisplay } from './interface';

interface Props {
    keys: CachedKey[];
    User: any;
    Address?: Address;
    loadingKeyID?: string;
}
const useDisplayKeys = ({ keys, User, Address, loadingKeyID }: Props) => {
    const [result, setResult] = useState<KeyDisplay[]>([]);

    useEffect(() => {
        const run = async () => {
            const parsedKeys = await getParsedKeys(keys);
            const results = parsedKeys.map(({ Key, privateKey }) => {
                const algorithmInfo = privateKey?.getAlgorithmInfo() ?? { algorithm: '' };
                const fingerprint = privateKey?.getFingerprint() ?? '';
                const isDecrypted = privateKey?.isDecrypted() ?? false;

                return getDisplayKey({
                    User,
                    Address,
                    Key,
                    // @ts-ignore
                    algorithmInfo,
                    fingerprint,
                    isLoading: loadingKeyID === Key.ID,
                    isDecrypted
                });
            });
            setResult(results);
        };
        run();
    }, [User, Address, keys]);

    return result;
};

export default useDisplayKeys;
