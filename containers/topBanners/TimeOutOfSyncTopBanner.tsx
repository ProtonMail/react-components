import React, { useState } from 'react';
import { c } from 'ttag';
import { Href } from '../../components';
import TopBanner from './TopBanner';

import useApiStatus from '../../hooks/useApiStatus';

const MILLISECONDS_24_HOURS = 24 * 3600 * 1000;
const isOutOfSync = (serverTime?: Date) => {
    if (serverTime === undefined) {
        return false;
    }

    const timeDifference = Math.abs(serverTime.getTime() - Date.now());
    // We should allow at least a 14-hour time difference,
    // because of potential internal clock issues when using dual-boot with Windows and a different OS
    return timeDifference > MILLISECONDS_24_HOURS;
};

const TimeOutOfSyncTopBanner = () => {
    const [ignore, setIgnore] = useState(false);
    const { serverTime } = useApiStatus();

    // We warn the user if the server time is too far off from local time.
    // We do not want the server to set arbitrary times, to avoid signature replay issues and more
    if (ignore || !isOutOfSync(serverTime)) {
        return null;
    }

    const learnMoreLink = (
        <Href key="time-sync-learn-more-link" className="underline inline-block color-inherit" url="#TODO">{c('Link')
            .t`Learn more`}</Href>
    );

    return (
        <TopBanner onClose={() => setIgnore(true)} className="bg-warning">
            {c('Warning').jt`Your local date & time settings seem to be out of sync. ${learnMoreLink}`}
        </TopBanner>
    );
};

export default TimeOutOfSyncTopBanner;
