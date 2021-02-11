import React, { useRef } from 'react';
import { c } from 'ttag';

import { generateProtonWebUID } from 'proton-shared/lib/helpers/uid';

import { useModals, useUser, useNotifications } from '../../hooks';
import { PrimaryButton, Alert, Icon } from '../../components';

import { OAUTH_PROVIDER } from './interfaces';
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SCOPE, GOOGLE_OAUTH_REDIRECT_PATH } from './constants';
import ImportMailModal from './modals/ImportMailModal';

const getRedirectURL = () => {
    const { protocol, host } = window.location;
    return `${protocol}//${host}${GOOGLE_OAUTH_REDIRECT_PATH}`;
};

const getAuthorizationUrl = () => {
    const params = new URLSearchParams();

    params.append('redirect_uri', getRedirectURL());
    params.append('response_type', 'code');
    params.append('access_type', 'offline');
    params.append('client_id', GOOGLE_OAUTH_CLIENT_ID);
    params.append('scope', GOOGLE_OAUTH_SCOPE);
    params.append('prompt', 'consent');

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 600;

const TEST_IDS = [
    'cxinT4HnEQpRz7FHRiGu7CjH9pFULfMwqHc9mv65yycL99EohZgfRP7eMbBUMlEZG4Ks_yszjrcMzDeKD2No6w==', // Oauthverify1
    'ddjZNL8VtjZIOVR6tenP3u1Yj9s-hRLPFHuK-iDPnJunIano7ExK27dZGG41Z7t-4NQ_JJB1W2pK1N6dgEuVTA==', // Oauthverify2
    'hFe07LzzAjBB4HxpAZnIiK7nUIja1qXkdOGPAlPeToHDKd7KlFvovGzZD13Ylp1DrJ00wJkqifz58YeYlVmxFg==', // Oauthverify3
];

const StartImportSection = () => {
    const [user] = useUser();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();

    const stateId = useRef<string>();

    const handleClick = () => createModal(<ImportMailModal />);

    const handleOauthClick = (provider: OAUTH_PROVIDER) => {
        let interval: number;

        const uid = generateProtonWebUID();
        stateId.current = uid;

        const authWindow = window.open(
            `${getAuthorizationUrl()}&state=${uid}`,
            'googleAuth',
            `height=${WINDOW_HEIGHT},width=${WINDOW_WIDTH},top=${window.screen.height / 2 - WINDOW_HEIGHT / 2},left=${
                window.screen.width / 2 - WINDOW_WIDTH / 2
            }`
        );

        if (authWindow) {
            authWindow.focus();
            authWindow.onbeforeunload = () => window.clearInterval(interval);

            /*
                To be changed by a proper callback URL that will
                communicate with this component via `window.postMessage()`
                We can then move the following logic to a `onmessage` listener
            */
            interval = window.setInterval(() => {
                const redirectURI = getRedirectURL();

                try {
                    const url = new URL(authWindow.document.URL);
                    const params = new URLSearchParams(url.search);

                    if (authWindow.document.URL.startsWith(redirectURI)) {
                        authWindow.close();
                        window.clearInterval(interval);

                        const error = params.get('error');

                        if (error) {
                            createNotification({
                                text: (
                                    <div className="text-center">
                                        {c('Error').t`Authentication canceled.`}
                                        <br />
                                        {c('Error').t`Your import will not be processed.`}
                                    </div>
                                ),
                                type: 'error',
                            });
                            return;
                        }

                        const state = params.get('state');

                        // State passthrough mismatch error
                        if (state !== stateId.current) {
                            createNotification({
                                text: (
                                    <div className="text-center">
                                        {c('Error').t`Authentication error.`}
                                        <br />
                                        {c('Error').t`Your import will not be processed.`}
                                    </div>
                                ),
                                type: 'error',
                            });
                            return;
                        }

                        const code = params.get('code');

                        if (!code) {
                            return;
                        }

                        createModal(<ImportMailModal oauthProps={{ code, provider, redirectURI }} />);
                    }
                } catch (err) {
                    // silent error
                }
            }, 100);
        }
    };

    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/import-assistant/">
                {c('Info')
                    .t`Transfer your data safely to Proton. Import Assistant connects to your external email provider and imports your selected messages and folders.`}
            </Alert>

            <div className="flex flex-flex-align-items-center">
                {TEST_IDS.includes(user.ID) ? (
                    <PrimaryButton
                        className="inline-flex flex-justify-center mt0-5 mr1"
                        onClick={() => handleOauthClick(OAUTH_PROVIDER.GMAIL)}
                    >
                        <Icon name="gmail" className="mr0-5" />
                        {c('Action').t`Continue with Google`}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton className="inline-flex flex-justify-center mt0-5" onClick={handleClick}>
                        <Icon name="imap-smtp" className="mr0-5" />
                        {c('Action').t`Continue with IMAP`}
                    </PrimaryButton>
                )}
            </div>
        </>
    );
};

export default StartImportSection;
