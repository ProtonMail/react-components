import { queryPlans } from 'proton-shared/lib/api/payments';
import { DEFAULT_CURRENCY } from 'proton-shared/lib/constants';

import useCachedModelResult from './useCachedModelResult';
import useApi from '../containers/api/useApi';
import useCache from '../containers/cache/useCache';

const KEY = 'plans';

const getPlans = (api, Currency) => api(queryPlans({ Currency })).then(({ Plans }) => Plans);

const usePlans = (currency = DEFAULT_CURRENCY) => {
    const api = useApi();
    const cache = useCache();
    return useCachedModelResult(cache, KEY, () => getPlans(api, currency));
};

export default usePlans;
