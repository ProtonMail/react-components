import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { APPS_CONFIGURATION } from 'proton-shared/lib/constants';

import { LinkButton } from '../../components';
import { useConfig } from '../../hooks';
import TopBanner from './TopBanner';

const EVERY_THIRTY_MINUTES = 30 * 60 * 1000;
const isDifferent = (a?: string, b?: string) => !!a && !!b && b !== a;

const NewVersionTopBanner = () => {
    const { VERSION_PATH, COMMIT_RELEASE, APP_NAME } = useConfig();
    const [newVersionAvailable, setNewVersionAvailable] = useState(false);

    const isNewVersionAvailable = async () => {
        const { commit } = await fetch(VERSION_PATH).then((response) => response.json());
        setNewVersionAvailable(isDifferent(commit, COMMIT_RELEASE));
    };

    useEffect(() => {
        isNewVersionAvailable();
        const intervalID = setInterval(() => {
            isNewVersionAvailable();
        }, EVERY_THIRTY_MINUTES);
        return () => clearInterval(intervalID);
    }, []);

    // No banner during local development
    if (window.location.hostname === 'localhost') {
        return null;
    }

    if (!newVersionAvailable) {
        return null;
    }

    const appName = APPS_CONFIGURATION[APP_NAME].name;
    const reloadTab = () => window.location.reload();
    const reloadButton = (
        <LinkButton className="color-currentColor" onClick={() => reloadTab()}>{c('Action').t`Reload tab`}</LinkButton>
    );

    return (
        <TopBanner className="bg-global-attention">
            {c('Message display when a new app version is available')
                .jt`A new version of ${appName} is available. ${reloadButton}.`}
        </TopBanner>
    );
};

export default NewVersionTopBanner;
