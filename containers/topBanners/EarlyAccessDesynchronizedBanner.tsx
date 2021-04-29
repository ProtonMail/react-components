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

    const refreshButton = <InlineLinkButton onClick={handleRefreshClick}>{c('Action').t`Refresh`}</InlineLinkButton>;

    if (!earlyAccess.environmentIsDesynchronized) {
        return null;
    }

    return (
        <TopBanner className="bg-info">
            {earlyAccess.value
                ? c('Info')
                      .jt`You have enabled Early Access. ${refreshButton} the page to use the latest version of [insert name of product].`
                : c('Info')
                      .jt`You have disabled Early Access. ${refreshButton} the page to use the stable version of [insert name of product].`}
        </TopBanner>
    );
};

export default EarlyAccessDesynchronizedBanner;
