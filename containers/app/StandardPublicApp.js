import React, { useEffect, useState } from 'react';
import { LoaderPage, GenericError, ModalsChildren, lazyLocales as locales } from 'react-components';
import PropTypes from 'prop-types';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getBrowserLocale, getClosestMatches } from 'proton-shared/lib/i18n/helper';
import loadLocale from 'proton-shared/lib/i18n/loadLocale';

const StandardPublicApp = ({ openpgpConfig, children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const browserLocale = getBrowserLocale();

        (async () => {
            await Promise.all([
                loadOpenPGP(openpgpConfig),
                loadLocale({
                    ...getClosestMatches({
                        locale: browserLocale,
                        browserLocale,
                        locales
                    }),
                    locales
                })
            ]);
        })()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <GenericError />;
    }

    if (loading) {
        return <LoaderPage />;
    }

    return (
        <>
            <ModalsChildren />
            {children}
        </>
    );
};

StandardPublicApp.propTypes = {
    openpgpConfig: PropTypes.object,
    children: PropTypes.node
};

export default StandardPublicApp;
