import { useEffect } from 'react';
import { setCookie, checkCookie } from 'proton-shared/lib/helpers/cookies';

import { useUser } from './useUser';

const COOKIE_NAME = 'is-paid-user';

const usePaidCookie = () => {
    const { hostname } = window.location;
    const secondLevelDomain = hostname.substr(hostname.indexOf('.') + 1);
    const cookieDomain = `.${secondLevelDomain}`;
    const [{ isPaid }] = useUser();

    useEffect(() => {
        if (isPaid && !checkCookie(COOKIE_NAME, 'true')) {
            setCookie(COOKIE_NAME, 'true', undefined, cookieDomain);
        }
    }, []);
};

export default usePaidCookie;
