import { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'proton-shared/lib/helpers/cookies';

const useCookieState = (cookieValue: string, cookieName: string, expirationDate?: string, cookieDomain?: string) => {
    const [value, setValue] = useState(() => {
        const cookie = getCookie(cookieName, cookieValue);
        if (!cookie) {
            return cookieValue;
        }
        const [keyValue] = cookie.split(';');
        const [, stickyValue] = keyValue.split('=');
        return stickyValue;
    });

    useEffect(() => {
        setCookie(cookieName, cookieValue, expirationDate, cookieDomain);
    }, [value]);

    return [value, setValue];
};

export default useCookieState;
