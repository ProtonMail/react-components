import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getBrowserLocale, getClosestMatches } from 'proton-shared/lib/i18n/helper';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';
import { InvalidForkConsumeError } from 'proton-shared/lib/authentication/error';
import { consumeFork, getConsumeForkParameters } from 'proton-shared/lib/authentication/forking';
import { LoaderPage, ModalsChildren, useApi, OnLoginCallback } from '../../index';
import CollapsableError from '../error/CollapsableError';

interface Props {
    locales?: any;
    openpgpConfig?: object;
    children: React.ReactNode;
    onLogin: OnLoginCallback;
}

const SSOForkConsumer = ({ onLogin, locales = {} }: Props) => {
    const [loading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const api = useApi();

    useEffect(() => {
        const browserLocale = getBrowserLocale();

        const loadForkDependencies = async () => {
            const { state, selector } = getConsumeForkParameters();
            if (!state || !selector) {
                throw new InvalidForkConsumeError('Missing state or selector');
            }
            const { UID, keyPassword, LocalID } = await consumeFork({ selector, api, state });
            onLogin({ UID, keyPassword, LocalID });
        };

        (async () => {
            await Promise.all([
                loadOpenPGP().then(() => {
                    return loadForkDependencies();
                }),
                loadLocale({
                    ...getClosestMatches({ locale: browserLocale, browserLocale, locales }),
                    locales,
                }),
            ]);
        })()
            .catch((e) => {
                if (e instanceof InvalidForkConsumeError) {
                    //return history.replace('/');
                }
                setError(e)
            });
    }, []);

    if (error) {
        return <CollapsableError error={error} />;
    }

    if (loading) {
        return (
            <>
                <LoaderPage />
                <ModalsChildren/>
            </>
        )
    }

    return null;
};

export default SSOForkConsumer;
