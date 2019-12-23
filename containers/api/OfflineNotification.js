import { c } from 'ttag';
import React from 'react';
import { LinkButton, useLoading } from 'react-components';

const OfflineNotification = ({ onRetry }) => {
    const [loading, withLoading] = useLoading();
    const retryNow = (
        <LinkButton className="alignbaseline p0" disabled={loading} onClick={() => withLoading(onRetry())}>{c('Action')
            .t`Retry now`}</LinkButton>
    );
    return (
        <>
            {c('Error').jt`Servers are unreachable.`} {retryNow}
        </>
    );
};

export default OfflineNotification;
