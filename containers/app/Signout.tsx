import React, { useEffect } from 'react';
import { revoke } from 'proton-shared/lib/api/auth';
import { removePersistedSession } from 'proton-shared/lib/authentication/persistedSessionStorage';
import { c } from 'ttag';
import { wait } from 'proton-shared/lib/helpers/promise';
import { removeLastRefreshDate } from 'proton-shared/lib/api/helpers/refreshStorage';

import { useApi, useAuthentication } from '../../hooks';
import LoaderPage from './LoaderPage';

interface Props {
    onDone: () => void;
}

const Signout = ({ onDone }: Props) => {
    const api = useApi();
    const authentication = useAuthentication();

    useEffect(() => {
        const run = async () => {
            const localID = authentication.getLocalID?.();
            const UID = authentication.getUID?.();
            return Promise.all([
                wait(200),
                UID ? api({ ...revoke(), silence: true }) : undefined,
                UID ? removeLastRefreshDate(UID) : undefined,
                localID !== undefined ? removePersistedSession(localID) : undefined,
            ]);
        };
        run().finally(onDone);
    }, []);

    return <LoaderPage text={c('Action').t`Signing out`} />;
};

export default Signout;
