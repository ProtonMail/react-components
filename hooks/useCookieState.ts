import React, { useState, useEffect } from 'react';
import { checkCookie, setCookie, SetCookieArguments } from 'proton-shared/lib/helpers/cookies';
import { getSecondLevelDomain } from 'proton-shared/lib/helpers/url';

const COOKIE_VALUE = '1';

interface Props extends Omit<SetCookieArguments, 'cookieValue'> {
    cookieValue?: string;
}

// By default a cookie state is available on all subdomains
const useCookieState = ({
    cookieName,
    cookieValue = COOKIE_VALUE,
    expirationDate,
    path = '/',
    cookieDomain = `.${getSecondLevelDomain()}`,
}: Props): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const [value, setValue] = useState(() => !!checkCookie(cookieName, cookieValue));

    useEffect(() => {
        if (value) {
            setCookie({
                cookieName,
                cookieValue,
                expirationDate,
                path,
                cookieDomain,
            });
        }
    }, [value]);

    return [value, setValue];
};

export default useCookieState;
