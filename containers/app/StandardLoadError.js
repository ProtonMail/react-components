import React, { useEffect } from 'react';
import GenericError from '../error/GenericError';

const StandardLoadError = () => {
    useEffect(() => {
        const wasOffline = !navigator.onLine;

        const handleOnline = () => {
            // If the user was offline and it comes back online, automatically refresh the page.
            if (wasOffline && navigator.onLine) {
                return window.location.reload();
            }
        };

        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return <GenericError />;
};

export default StandardLoadError;
