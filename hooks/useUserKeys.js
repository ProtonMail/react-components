import { usePromiseResult } from 'react-components';
import useUserKeysAsync from './useUserKeysAsync';

const useUserKeys = () => {
    const getUserKeysAsync = useUserKeysAsync();

    // TODO: Fix to use the existing cached result
    return usePromiseResult(async () => {
        return getUserKeysAsync();
    }, []);
};

export default useUserKeys;
