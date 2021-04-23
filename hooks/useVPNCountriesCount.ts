import { useEffect, useState } from 'react';
import { queryVPNCountriesCount } from 'proton-shared/lib/api/vpn';
import { PLANS } from 'proton-shared/lib/constants';
import { VPNCountries } from 'proton-shared/lib/interfaces';

import useApi from './useApi';
import useLoading from './useLoading';

const DEFAULT_RESULT: VPNCountries = {
    free_vpn: { count: 4 },
    [PLANS.VPNBASIC]: { count: 14 },
    [PLANS.VPNPLUS]: { count: 15 },
};

const useVPNCountriesCount = (): [VPNCountries, boolean] => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [result, setResult] = useState(DEFAULT_RESULT);

    useEffect(() => {
        const query = async () => {
            const { Counts = [] } = await api<{ Counts: { Count: number }[] }>(queryVPNCountriesCount());

            // TODO: Remove when config changes for proper count from API response will be deployed
            Counts[1] = { Count: 43 };

            const result = ([
                [0, 'free_vpn'],
                [1, PLANS.VPNBASIC],
                [2, PLANS.VPNPLUS],
            ] as const).reduce(
                (acc, [idx, planName]) => {
                    const count = Counts[idx]?.Count || 0;
                    return {
                        ...acc,
                        [planName]: { count },
                    };
                },
                { ...DEFAULT_RESULT }
            );
            setResult(result);
        };

        void withLoading(query());
    }, []);

    return [result, loading];
};

export default useVPNCountriesCount;
