import { useEffect } from 'react';
import { setCookie, checkCookie } from 'proton-shared/lib/helpers/cookies';
import { getSecondLevelDomain } from 'proton-shared/lib/helpers/url';

import { useUser } from './useUser';

const COOKIE_NAME = 'is-paid-user';

const usePaidCookie = () => {
    const [user] = useUser();

    useEffect(() => {
        const cookieDomain = `.${getSecondLevelDomain()}`;
        const today = new Date();
        const lastDayOfTheYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

        if (user.isPaid && !checkCookie(COOKIE_NAME, 'true')) {
            setCookie({
                cookieName: COOKIE_NAME,
                cookieValue: 'true',
                cookieDomain,
                expirationDate: lastDayOfTheYear.toUTCString(),
                path: '/',
            });
        }
    }, [user]);
};

export default usePaidCookie;
