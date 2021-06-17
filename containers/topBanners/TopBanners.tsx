import React from 'react';

import NewVersionTopBanner from './NewVersionTopBanner';
import DelinquentTopBanner from './DelinquentTopBanner';
import StorageLimitTopBanner from './StorageLimitTopBanner';
import OnlineTopBanner from './OnlineTopBanner';
import SubUserTopBanner from './SubUserTopBanner';
import DeskopNotificationTopBanner from './DeskopNotificationTopBanner';
import EarlyAccessDesynchronizedBanner from './EarlyAccessDesynchronizedBanner';

interface Props {
    children?: React.ReactNode;
}

const TopBanners = ({ children }: Props) => {
    return (
        <>
            <DelinquentTopBanner />
            <OnlineTopBanner />
            <StorageLimitTopBanner />
            <NewVersionTopBanner />
            <SubUserTopBanner />
            <DeskopNotificationTopBanner />
            <EarlyAccessDesynchronizedBanner />
            {children}
        </>
    );
};

export default TopBanners;
