import { usePromiseResult } from 'react-components';
import useAddressesAsync from './useAddressesAsync';
import useAddressKeysAsync from './useAddressKeysAsync';

const useAddressesKeys = () => {
    const getAddresses = useAddressesAsync();
    const getAddressKeys = useAddressKeysAsync();

    return usePromiseResult(async () => {
        const addresses = await getAddresses();
        const keys = await Promise.all(addresses.map(({ ID: addressID }) => getAddressKeys(addressID)));
        return addresses.reduce((acc, { ID }, i) => {
            return {
                ...acc,
                [ID]: keys[i]
            };
        }, {});
    }, []);
};

export default useAddressesKeys;
