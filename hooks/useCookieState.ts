import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'proton-shared/lib/helpers/cookies';

const useCookieState = (
    cookieValue: string,
    cookieName: string,
    expirationDate?: string,
    cookieDomain?: string
): [string, React.Dispatch<React.SetStateAction<string>>] => {
    const [value, setValue] = useState(() => {
        const cookie = getCookie(cookieName, cookieValue);
        if (!cookie) {
            return cookieValue;
        }
        const [, stickyValue] = cookie.split('=');
        return stickyValue;
    });

    useEffect(() => {
        setCookie(cookieName, value, expirationDate, cookieDomain);
    }, [value]);

    return [value, setValue];
};

export default useCookieState;
