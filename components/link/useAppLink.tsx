import { useCallback } from 'react';
import {
    APP_NAMES,
    isSSOMode,
    isStandaloneMode
} from 'proton-shared/lib/constants';
import { getAppHref, getAppHrefBundle } from 'proton-shared/lib/apps/helper';

import { useAuthentication, useConfig } from '../..';

export interface Props {
    to: string;
    toApp?: APP_NAMES;
}

const useAppLink = () => {
    const { APP_NAME } = useConfig();
    const authentication = useAuthentication();

    return useCallback(({ to, toApp }: Props) => {
        if (toApp && toApp !== APP_NAME) {
            if (isSSOMode) {
                const localID = authentication.getLocalID?.();
                const href = getAppHref(to, toApp, localID);
                return document.location.assign(href);
            }
            if (isStandaloneMode) {
                return;
            }
            return document.location.assign(getAppHrefBundle(to, toApp));
        }

        return history.pushState(to);
    }, [authentication]);
};

export default useAppLink;
