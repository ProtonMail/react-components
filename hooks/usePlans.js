import { useCallback } from 'react';
import { useCachedResult, useApi, useCache } from 'react-components';
import { queryPlans } from 'proton-shared/lib/api/payments';
import { CYCLE } from 'proton-shared/lib/constants';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;
const KEY = 'plans';

const usePlans = () => {
    const api = useApi();
    const cache = useCache();
    const getPlans = (Cycle) => api(queryPlans({ Cycle })).then(({ Plans }) => Plans);

    const load = useCallback(async () => {
        const [monthly, yearly, twoYears] = await Promise.all([
            getPlans(MONTHLY),
            getPlans(YEARLY),
            getPlans(TWO_YEARS)
        ]);
        return [].concat(monthly, yearly, twoYears);
    }, []);

    return useCachedResult(cache, KEY, load);
};

export default usePlans;
