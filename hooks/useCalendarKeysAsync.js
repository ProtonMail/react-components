import { useCallback } from 'react';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { noop } from 'proton-shared/lib/helpers/function';
import { decryptCalendarKeys, decryptPassphrase, getAddressesMembersMap } from 'proton-shared/lib/keys/calendarKeys';
import useCache from '../containers/cache/useCache';
import useCachedModelAsync from './useCachedModelAsync';
import useAddressesAsync from './useAddressesAsync';
import useCalendarBootstrapAsync from './useCalendarBootstrapAsync';
import useAddressKeysAsync from './useAddressKeysAsync';

const useCalendarKeysAsync = () => {
    const cache = useCache();
    const getAddresses = useAddressesAsync();
    const getAddressKeys = useAddressKeysAsync();
    const getCalendarBootstrap = useCalendarBootstrapAsync();

    const miss = useCallback(
        async (calendarID) => {
            const [{ Keys, Passphrase = {}, Members }, Addresses] = await Promise.all([
                getCalendarBootstrap(calendarID),
                getAddresses()
            ]);

            const getCalendarKeyPassphrase = async (MemberPassphrases = [], addressesMembersMap = {}) => {
                // Try to decrypt each passphrase with the address keys belonging to that member until it succeeds.
                // eslint-disable-next-line no-restricted-syntax
                for (const { Passphrase, Signature, MemberID } of MemberPassphrases) {
                    const Address = addressesMembersMap[MemberID];
                    if (!Address) {
                        continue;
                    }
                    const addressKeys = await getAddressKeys(Address.ID).catch(noop);
                    const result = await decryptPassphrase({
                        armoredPassphrase: Passphrase,
                        armoredSignature: Signature,
                        ...splitKeys(addressKeys)
                    }).catch(noop);
                    if (result) {
                        return result;
                    }
                }
            };

            const { ID: PassphraseID, MemberPassphrases } = Passphrase;
            const addressesMembersMap = getAddressesMembersMap(Members, Addresses);
            const passphrase = await getCalendarKeyPassphrase(MemberPassphrases, addressesMembersMap);
            return decryptCalendarKeys(Keys, { [PassphraseID]: passphrase });
        },
        [getAddresses, getAddressKeys, getCalendarBootstrap]
    );

    if (!cache.has('calendarKeys')) {
        cache.set('calendarKeys', new Map());
    }
    const calendarKeysCache = cache.get('calendarKeys');

    return useCachedModelAsync(calendarKeysCache, miss);
};

export default useCalendarKeysAsync;
