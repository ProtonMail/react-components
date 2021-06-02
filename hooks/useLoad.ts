import { useEffect } from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { load } from 'proton-shared/lib/api/core/load';
import { getAppFromPathnameSafe, getSlugFromApp } from 'proton-shared/lib/apps/slugHelper';

import useApi from './useApi';

const useLoad = () => {
    const api = useApi();

    /*
     * React Router's location is used here instead of the window.location
     * since window location also includes any prefixed base-name such as "/u/6"
     */
    const location = useLocation<typeof window.location>();

    /*
     * The "path" property on React Router's "match" object contains the
     * path pattern that was used to match the current pathname.
     *
     * It therefore contains the names of any dynamic parameters rather
     * than their values.
     *
     * This is an important distinction for three reasons:
     * - it makes it possible to tell which segments of the pathname are parameters (":")
     * - this path looks the same indifferent of how the parameters are populated
     * - it allows us to sent the load request without leaking any potentially sensitive data
     */
    const { path } = useRouteMatch();

    useEffect(() => {
        const app = getAppFromPathnameSafe(location.pathname);

        if (!app) {
            return;
        }

        const appSlug = getSlugFromApp(app);

        if (appSlug) {
            api({ ...load(appSlug, path), silent: true });
        }
    }, []);
};

export default useLoad;
