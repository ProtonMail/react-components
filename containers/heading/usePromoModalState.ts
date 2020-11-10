import { useEffect, useState } from 'react';
import { getFeature, updateFeatureValue } from 'proton-shared/lib/api/features';
import { getSHA256String } from 'proton-shared/lib/helpers/hash';
import { BLACK_FRIDAY } from 'proton-shared/lib/constants';
import { getCookie } from 'proton-shared/lib/helpers/cookies';

import { useApi, useUser } from '../../hooks';

const FEATURE_ID = 'BlackFridayPromoShown';

const usePromoModalState = () => {
    const [state, setState] = useState(false);
    const api = useApi();
    const [user] = useUser();

    const fetchFeature = async () => {
        // Search cookie state first
        const [newBlackFridayStateKey, newProductPayerStateKey] = await Promise.all([
            getSHA256String(`${user.ID}${BLACK_FRIDAY.COUPON_CODE}-black-friday-modal`),
            getSHA256String(`${user.ID}-product-payer-modal`),
        ]);
        const blackFridayStateKey = newBlackFridayStateKey.slice(0, 8);
        const productPayerStateKey = newProductPayerStateKey.slice(0, 8);

        if (getCookie(blackFridayStateKey) || getCookie(productPayerStateKey)) {
            setState(true);
            return;
        }

        // Otherwise check API state
        const { Feature } = await api(getFeature(FEATURE_ID));
        const { Value, DefaultValue } = Feature;
        setState(typeof Value === 'undefined' ? DefaultValue : Value);
    };

    useEffect(() => {
        fetchFeature();
    }, []);

    const onChange = async (Value: boolean) => {
        await api(updateFeatureValue(FEATURE_ID, Value));
        setState(Value);
    };

    return [state, onChange];
};

export default usePromoModalState;
