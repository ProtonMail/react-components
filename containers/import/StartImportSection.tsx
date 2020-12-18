import React, { useRef } from 'react';
import { c } from 'ttag';

import { generateProtonWebUID } from 'proton-shared/lib/helpers/uid';

import { useModals } from '../../hooks';
import { PrimaryButton, Alert, Icon } from '../../components';

import { OAUTH_PROVIDER } from './interfaces';
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URL, GOOGLE_OAUTH_SCOPE } from './constants';
import ImportMailModal from './modals/ImportMailModal';

const getAuthorizationUrl = () => {
    const params = new URLSearchParams();
    params.append('redirect_uri', GOOGLE_OAUTH_REDIRECT_URL);
    params.append('response_type', 'code');
    params.append('access_type', 'offline');
    params.append('client_id', GOOGLE_OAUTH_CLIENT_ID);
    params.append('scope', GOOGLE_OAUTH_SCOPE);
    params.append('prompt', 'consent');

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 600;

const StartImportSection = () => {
    const { createModal } = useModals();
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
                try {
                    const url = authWindow.document.URL;

                    if (url.includes(GOOGLE_OAUTH_REDIRECT_URL)) {
                        authWindow.close();
                        window.clearInterval(interval);

                        const query = decodeURIComponent(url.split('?').length > 0 ? url.split('?')[1] : '/');

                        if (query.includes('error')) {
                            const error = query.split('error=')[1].split('&')[0];
                            window.alert(error);
                            return;
                        }

                        const state = query.split('state=')[1].split('&')[0];

                        if (state !== stateId.current) {
                            window.alert('state passthru mismatch');
                            return;
                        }

                        const code = query.split('code=')[1].split('&')[0];

                        createModal(
                            <ImportMailModal
                                oauthProps={{
                                    code,
                                    provider,
                                    redirectURI: GOOGLE_OAUTH_REDIRECT_URL,
                                }}
                            />
                        );
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

            <div className="flex flex-align-items">
                <PrimaryButton
                    className="inline-flex flex-items-center flex-justify-center mt0-5 mr1"
                    onClick={() => handleOauthClick(OAUTH_PROVIDER.GMAIL)}
                >
                    <Icon name="gmail" className="mr0-5" />
                    {c('Action').t`Continue with Google`}
                </PrimaryButton>
                <PrimaryButton
                    className="inline-flex flex-items-center flex-justify-center mt0-5"
                    onClick={handleClick}
                >
                    <Icon name="imap-smtp" className="mr0-5" />
                    {c('Action').t`Continue with IMAP`}
                </PrimaryButton>
            </div>
        </>
    );
};

export default StartImportSection;
