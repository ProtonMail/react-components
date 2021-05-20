import React, { useState, useEffect, useRef } from 'react';
import { c } from 'ttag';
import { ping } from 'proton-shared/lib/api/tests';
import { wait } from 'proton-shared/lib/helpers/promise';

import { useLoading, useOnline } from '../../hooks';
import TopBanner from './TopBanner';
import useApiStatus from '../../hooks/useApiStatus';
import { InlineLinkButton } from '../../components/button';
import useApi from '../../hooks/useApi';
import { CircleLoader, useDebounceInput } from '../../components';

const OFFLINE_TIMEOUT = 2500;

const OnlineTopBanner = () => {
    const { apiUnreachable, offline } = useApiStatus();
    const onlineStatus = useOnline();
    const safeOnlineStatusValue = onlineStatus && !offline;
    const safeOnlineStatus = useDebounceInput(safeOnlineStatusValue, safeOnlineStatusValue ? 0 : OFFLINE_TIMEOUT);
    const api = useApi();
    const [loading, withLoading] = useLoading();

    const oldRef = useRef(safeOnlineStatus);
    const [backOnline, setBackOnline] = useState(false);

    useEffect(() => {
        if (onlineStatus && offline) {
            // Ping directly to update the API offline status
            api(ping());
        }
    }, [onlineStatus, offline]);

    useEffect(() => {
        if (oldRef.current === safeOnlineStatus) {
            return;
        }
        oldRef.current = safeOnlineStatus;

        if (!safeOnlineStatus) {
            const handle = window.setInterval(() => {
                api(ping());
            }, 5000);
            return () => window.clearInterval(handle);
        }

        setBackOnline(true);

        const handle = window.setTimeout(() => {
            setBackOnline(false);
            // Ensure it's true
            api(ping());
        }, 2000);

        return () => window.clearTimeout(handle);
    }, [safeOnlineStatus]);

    if (safeOnlineStatus && backOnline) {
        return <TopBanner className="bg-success">{c('Info').t`Internet connection restored.`}</TopBanner>;
    }

    if (safeOnlineStatus) {
        // If the device is known to be online, and the API is unreachable
        if (apiUnreachable) {
            const handleRetry = async () => {
                api(ping());
                await wait(800);
            };
            const retryNow = (
                <InlineLinkButton
                    key="0"
                    className="color-inherit"
                    disabled={loading}
                    onClick={() => withLoading(handleRetry())}
                >
                    {c('Action').t`Retry now`}
                    {loading ? <CircleLoader /> : null}
                </InlineLinkButton>
            );

            return <TopBanner className="bg-danger">{c('Info').jt`Servers are unreachable. ${retryNow}.`}</TopBanner>;
        }
        return null;
    }

    // If the device is known to be offline, the API unreachable is not displayed.
    return (
        <TopBanner className="bg-danger">{c('Info')
            .t`Internet connection lost. Please check your device's connectivity.`}</TopBanner>
    );
};

export default OnlineTopBanner;
