import { useContext, useEffect } from 'react';

import { FeatureCode, FeaturesContext } from '../containers/features';

const useFeature = (code: FeatureCode) => {
    const { features, loading, get, put } = useContext(FeaturesContext);

    useEffect(() => {
        get(code);
    }, []);

    return {
        get: <V = any>() => get<V>(code),
        update: <V = any>(value: V) => put<V>(code, value),
        feature: features[code],
        loading: loading[code],
    };
};

export default useFeature;
