import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { APPS_CONFIGURATION } from 'proton-shared/lib/constants';

import { LinkButton } from '../../components';
import { useConfig } from '../../hooks';

import TopBanner from './TopBanner';

const NewVersionTopBanner = () => {
    const { VERSION_PATH, COMMIT_RELEASE, APP_NAME } = useConfig();
    const [newVersionAvailable, setNewVersionAvailable] = useState(false);
    const isDifferent = (a?: string, b?: string) => !!a && b !== a;

    const isNewVersionAvailable = async () => {
        const { commit } = await fetch(VERSION_PATH).then((response) => response.json());
        return isDifferent(commit, COMMIT_RELEASE);
    };

    useEffect(() => {
        const intervalID = setInterval(() => {
            isNewVersionAvailable().then(setNewVersionAvailable);
        }, 5 * 1000);
        return () => clearInterval(intervalID);
    }, []);

    if (!newVersionAvailable) {
        return null;
    }

    const appName = APPS_CONFIGURATION[APP_NAME].name;
    const reloadTab = () => window.location.reload();
    const reloadButton = () => <LinkButton onClick={() => reloadTab()}>{c('Action').t`Reload tab`}</LinkButton>;

    return (
        <TopBanner className="bg-global-attention">
            {c('Message display when a new app version is available')
                .jt`A new version of ${appName} is available. ${reloadButton}.`}
        </TopBanner>
    );
};

export default NewVersionTopBanner;
