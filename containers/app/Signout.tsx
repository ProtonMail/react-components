import React, { useEffect } from 'react';
import { revoke } from 'proton-shared/lib/api/auth';
import { removePersistedSession } from 'proton-shared/lib/authentication/persistedSessionStorage';
import { c } from 'ttag';
import { wait } from 'proton-shared/lib/helpers/promise';
import { removeLastRefreshDate } from 'proton-shared/lib/api/helpers/refreshStorage';
import { removeItem } from 'proton-shared/lib/helpers/storage';
import { deleteDB } from 'idb';

import { useApi, useAuthentication, useGetUser } from '../../hooks';
import LoaderPage from './LoaderPage';
import { ProminentContainer } from '../../components';

interface Props {
    onDone: () => void;
}

const Signout = ({ onDone }: Props) => {
    const api = useApi();
    const authentication = useAuthentication();
    const getUser = useGetUser();

    const handleES = (userID: string) => {
        removeItem(`ES:${userID}:Key`);
        removeItem(`ES:${userID}:Event`);
        removeItem(`ES:${userID}:BuildEvent`);
        removeItem(`ES:${userID}:Recover`);
        return userID;
    };

    useEffect(() => {
        const run = async () => {
            const localID = authentication.getLocalID?.();
            const UID = authentication.getUID?.();
            const { ID: userID } = await getUser();
            return Promise.all([
                handleES(userID),
                wait(200),
                UID ? api({ ...revoke(), silence: true }) : undefined,
                UID ? removeLastRefreshDate(UID) : undefined,
                localID !== undefined ? removePersistedSession(localID) : undefined,
            ]);
        };
        run()
            .then(([userID]) => {
                void deleteDB(`ES:${userID}:DB`);
            })
            .finally(onDone);
    }, []);

    return (
        <ProminentContainer>
            <LoaderPage text={c('Action').t`Signing out`} />;
        </ProminentContainer>
    );
};

export default Signout;
