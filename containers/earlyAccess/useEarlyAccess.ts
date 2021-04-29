import { updateEarlyAccess } from 'proton-shared/lib/api/settings';
import { deleteCookie, getCookie, setCookie } from 'proton-shared/lib/helpers/cookies';
import { useEffect, useState } from 'react';
import { useApi, useLoading, useUserSettings } from '../../hooks';
import useFeature from '../../hooks/useFeature';
import { FeatureCode } from '../features';

export type Environment = 'alpha' | 'beta' | 'prod';

const getTargetEnvironment = (
    versionCookie: Environment | undefined,
    earlyAccessScope: Environment,
    earlyAccessUserSetting: boolean
): Environment => {
    if (!earlyAccessUserSetting) {
        return 'prod';
    }

    return versionCookie || earlyAccessScope;
};

const versionCookieAtLoad = getCookie('Version') as Environment | undefined;

const useEarlyAccess = () => {
    const api = useApi();
    const earlyAccessScope = useFeature(FeatureCode.EarlyAccessScope);
    const { feature: { Value: maybeEarlyAccess, DefaultValue } = {} } = earlyAccessScope;
    const [loadingUpdate, withLoadingUpdate] = useLoading();
    const [versionCookie, setVersionCookie] = useState(versionCookieAtLoad);
    const [userSettings, userSettingsLoading] = useUserSettings();

    const earlyAccessScopeValue = maybeEarlyAccess || DefaultValue;
    const hasLoaded = !(userSettingsLoading || earlyAccessScope.loading);

    const targetEnvironment = getTargetEnvironment(
        versionCookie,
        earlyAccessScope.feature?.Value,
        Boolean(userSettings.EarlyAccess)
    );

    const updateVersionCookie = (environment: Environment) => {
        setVersionCookie(targetEnvironment);

        if (environment === 'prod') {
            deleteCookie('Version');
        } else {
            setCookie({
                cookieName: 'Version',
                cookieValue: environment,
                expirationDate: 'max',
                path: '/',
            });
        }
    };

    useEffect(() => {
        if (!hasLoaded) {
            return;
        }

        if (versionCookie === targetEnvironment) {
            return;
        }

        updateVersionCookie(targetEnvironment);
    }, [hasLoaded, versionCookie, targetEnvironment]);

    /*
     * Shouldn't be able to call update without the request for the EarlyAccessScope
     * feature to have completed since the environment is set based on it should
     * earlyAccessEnabled be true
     */
    const canUpdate = earlyAccessScope.feature && 'Value' in earlyAccessScope.feature;

    const update = async (earlyAccessEnabled: boolean) => {
        if (!canUpdate) {
            return;
        }

        console.log('HENLO');
        await withLoadingUpdate(api(updateEarlyAccess({ EarlyAccess: Number(earlyAccessEnabled) })));
        console.log(JSON.stringify(earlyAccessScope, null, 2));

        console.log(earlyAccessEnabled ? earlyAccessScopeValue : 'prod');

        updateVersionCookie(earlyAccessEnabled ? earlyAccessScopeValue : 'prod');
    };

    const currentEnvironment = versionCookieAtLoad || 'prod';
    const currentEnvironmentMatchesTargetEnvironment = currentEnvironment === targetEnvironment;
    const environmentIsDesynchronized = hasLoaded && !currentEnvironmentMatchesTargetEnvironment;
    const loading = earlyAccessScope.loading || loadingUpdate;

    return {
        value: Boolean(userSettings.EarlyAccess),
        scope: earlyAccessScopeValue,
        canUpdate,
        update,
        loading,
        loadingUpdate,
        environmentIsDesynchronized,
        currentEnvironment,
    };
};

export default useEarlyAccess;
