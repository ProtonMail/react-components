import { useState, useCallback } from 'react';
import { getCookie, setCookie, SetCookieArguments } from 'proton-shared/lib/helpers/cookies';
import { getSecondLevelDomain } from 'proton-shared/lib/helpers/url';

interface Props extends Omit<SetCookieArguments, 'cookieValue'> {
    cookieValue?: string;
}

// By default a cookie state is available on all subdomains
const useCookieState = ({
    cookieName,
    expirationDate,
    path = '/',
    cookieDomain = `.${getSecondLevelDomain()}`,
}: Props): [string | undefined, (value: string | undefined) => void] => {
    const [value, setValue] = useState(() => getCookie(cookieName));

    const setCookieValue = useCallback(
        (value: string | undefined) => {
            if (!value) {
                setCookie({
                    cookieName,
                    cookieValue: '',
                    expirationDate: new Date(0).toUTCString(),
                    path,
                    cookieDomain,
                });
                return;
            }
            setCookie({
                cookieName,
                cookieValue: value,
                expirationDate,
                path,
                cookieDomain,
            });
            setValue(value);
        },
        [setValue]
    );

    return [value, setCookieValue];
};

export default useCookieState;
