import React from 'react';
import { c } from 'ttag';

import { InlineLinkButton } from '../../components';
import useEarlyAccess from '../../hooks/useEarlyAccess';
import TopBanner from './TopBanner';

const EarlyAccessDesynchronizedBanner = () => {
    const earlyAccess = useEarlyAccess();

    const handleRefreshClick = () => {
        window.location.reload();
    };

    const refreshButton = <InlineLinkButton onClick={handleRefreshClick}>{c('Link').t`here`}</InlineLinkButton>;

    if (!earlyAccess.environmentIsDesynchronized) {
        return null;
    }

    return (
        <TopBanner className="bg-info">
            {c('Info').jt`Your early access setting is ${
                earlyAccess.value ? c('Early access is enabled').t`enabled` : c('Early access is disabled').t`disabled`
            } but you were served the ${
                earlyAccess.currentEnvironment
            } version of the app. Click ${refreshButton} to refresh your browser and load the correct version of the app.`}
        </TopBanner>
    );
};

export default EarlyAccessDesynchronizedBanner;
