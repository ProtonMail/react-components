import useFeature from './useFeature';
import { FeatureCode } from '../containers';

const useEarlyAccess = () => {
    const { feature: { Value: earlyAccess } = {} } = useFeature(FeatureCode.EarlyAccess);

    const hasEarlyAccess = earlyAccess === 'alpha' || earlyAccess === 'beta';

    const hasAlphaAccess = earlyAccess === 'alpha';

    return { hasEarlyAccess, hasAlphaAccess };
};

export default useEarlyAccess;
