import { useEffect, useState } from 'react';
import { getFeature, updateFeature } from 'proton-shared/lib/api/features';

import { useApi } from '../../hooks';

const FEATURE_ID = 'BlackFridayPromoShown';

const usePromoModalState = () => {
    const [state, setState] = useState(false);
    const api = useApi();

    const fetchFeature = async () => {
        const { Feature } = await api(getFeature(FEATURE_ID));
        const { Value, DefaultValue } = Feature;
        setState(typeof Value === 'undefined' ? DefaultValue : Value);
    };

    useEffect(() => {
        fetchFeature();
    }, []);

    const onChange = async (Value: boolean) => {
        await api(updateFeature({ Code: FEATURE_ID, Value }));
        setState(Value);
    };

    return [state, onChange];
};

export default usePromoModalState;
