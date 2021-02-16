import React from 'react';
import { c } from 'ttag';

import { useModals, useUser } from '../../hooks';
import useOAuthPopup from '../../hooks/useOAuthPopup';
import { Button, Icon } from '../../components';

import { SettingsSection, SettingsParagraph } from '../account';

import { OAuthProps, OAUTH_PROVIDER } from './interfaces';
import { getOAuthRedirectURL as getRedirectURL, getOAuthAuthorizationUrl as getAuthorizationUrl } from './helpers';
import ImportMailModal from './modals/ImportMailModal';

const TEST_IDS = [
    'cxinT4HnEQpRz7FHRiGu7CjH9pFULfMwqHc9mv65yycL99EohZgfRP7eMbBUMlEZG4Ks_yszjrcMzDeKD2No6w==',
    'ddjZNL8VtjZIOVR6tenP3u1Yj9s-hRLPFHuK-iDPnJunIano7ExK27dZGG41Z7t-4NQ_JJB1W2pK1N6dgEuVTA==',
    'hFe07LzzAjBB4HxpAZnIiK7nUIja1qXkdOGPAlPeToHDKd7KlFvovGzZD13Ylp1DrJ00wJkqifz58YeYlVmxFg==',
];

const StartImportSection = () => {
    const [user] = useUser();
    const { createModal } = useModals();

    const { triggerOAuthPopup } = useOAuthPopup({ getRedirectURL, getAuthorizationUrl });

    const handleClick = () => createModal(<ImportMailModal />);

    const handleOAuthClick = () => {
        triggerOAuthPopup(OAUTH_PROVIDER.GMAIL, (oauthProps: OAuthProps) => {
            createModal(<ImportMailModal oauthProps={oauthProps} />);
        });
    };

    return (
        <SettingsSection>
            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/import-assistant/">
                {c('Info')
                    .t`Transfer your data safely to Proton. Import Assistant connects to your external email provider and imports your selected messages and folders.`}
            </SettingsParagraph>

            <div className="flex flex-flex-align-items-center">
                {TEST_IDS.includes(user.ID) ? (
                    <Button
                        color="norm"
                        className="inline-flex flex-justify-center mt0-5 mr1"
                        onClick={handleOAuthClick}
                    >
                        <Icon name="gmail" className="mr0-5" />
                        {c('Action').t`Continue with Google`}
                    </Button>
                ) : (
                    <Button color="norm" className="inline-flex flex-justify-center mt0-5" onClick={handleClick}>
                        {c('Action').t`Start import`}
                    </Button>
                )}
            </div>
        </SettingsSection>
    );
};

export default StartImportSection;
