import React, { useEffect } from 'react';
import { c } from 'ttag';
import GenericError from '../error/GenericError';
import { PrimaryButton } from '../../index';

const StandardLoadError = () => {
    useEffect(() => {
        const wasOffline = !navigator.onLine;

        const handleOnline = () => {
            // If the user was offline and comes back online, automatically refresh the page to retry the operation.
            // This is intended to handle the case where one of the dependencies fails to load due to a connection issue.
            if (wasOffline && navigator.onLine) {
                return window.location.reload();
            }
        };

        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return (
        <GenericError>
            <span>{c('Error message').t`There was a problem connecting to Proton.`}</span>
            <span>{c('Error message').t`Please refresh the page or check your connection.`}</span>
            <PrimaryButton className="mt1" onClick={() => window.location.reload()}>
                {c('Action').t`Refresh`}
            </PrimaryButton>
        </GenericError>
    );
};

export default StandardLoadError;
