import React, { useState } from 'react';
import { c } from 'ttag';
import { HOUR } from 'proton-shared/lib/constants';
import LearnMore from '../../components/link/LearnMore';
import TopBanner from './TopBanner';

import useApiStatus from '../../hooks/useApiStatus';

const isOutOfSync = (serverTime?: Date) => {
    if (serverTime === undefined) {
        return false;
    }

    const timeDifference = Math.abs(serverTime.getTime() - Date.now());
    // We should allow at least a 14-hour time difference,
    // because of potential internal clock issues when using dual-boot with Windows and a different OS
    return timeDifference > 24 * HOUR;
};

const TimeOutOfSyncTopBanner = () => {
    const [ignore, setIgnore] = useState(false);
    const { serverTime } = useApiStatus();

    // We warn the user if the server time is too far off from local time.
    // We do not want the server to set arbitrary times, to avoid signature replay issues and more
    if (ignore || !isOutOfSync(serverTime)) {
        return null;
    }

    return (
        <TopBanner onClose={() => setIgnore(true)} className="bg-warning">
            {c('Warning').jt`Your local date & time settings seem to be out of sync. ${(<LearnMore url="#TODO" />)}`}
        </TopBanner>
    );
};

export default TimeOutOfSyncTopBanner;
