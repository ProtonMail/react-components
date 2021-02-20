import React, { useState } from 'react';
import { c } from 'ttag';
import { getStatus, request, Status } from 'proton-shared/lib/helpers/desktopNotification';

import TopBanner from './TopBanner';

const DeskopNotificationTopBanner = () => {
    const [status, setStatus] = useState<Status>(getStatus());
    const [hide, setHide] = useState(false);

    if (hide) {
        return null;
    }

    if ([Status.GRANTED, Status.DENIED].includes(status)) {
        return null;
    }

    const handleEnable = () => {
        request(
            () => setStatus(getStatus()),
            () => setStatus(getStatus())
        );
    };

    const enableDesktopNotifications = (
        <button key="enable-desktop-notifications" type="button" onClick={handleEnable}>{c('Action')
            .t`enable desktop notifications`}</button>
    );

    return (
        <TopBanner onClose={() => setHide(true)} className="bg-pm-blue">{c('Info')
            .jt`Proton needs your permission to ${enableDesktopNotifications}`}</TopBanner>
    );
};

export default DeskopNotificationTopBanner;
