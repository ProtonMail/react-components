import { useState, useCallback, useEffect, useMemo } from 'react';
import { getClientVPNInfo } from 'proton-shared/lib/api/vpn';
import { useApi, useCache } from 'react-components';

const useUserVPN = () => {
    const api = useApi();
    const cache = useCache();
    const [state, setState] = useState(() => ({ result: cache.get('vpn'), loading: false }));

    const fetch = useCallback(async () => {
        try {
            const result = await api(getClientVPNInfo());
            cache.set('vpn', result);
            setState({ result, loading: false });
        } catch (e) {
            setState({ error: e, loading: false });
        }
    }, []);

    useEffect(() => {
        if (!cache.has('vpn')) {
            fetch();
        }
    }, []);

    return useMemo(
        () => ({
            ...state,
            fetch
        }),
        [state]
    );
};

export default useUserVPN;
