import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getActiveSessions, resumeSession } from 'proton-shared/lib/authentication/helper';
import { getProduceForkParameters, produceFork, ProduceForkParameters } from 'proton-shared/lib/authentication/forking';
import { InvalidForkProduceError, InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { LocalSessionResponse } from 'proton-shared/lib/authentication/interface';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/getApiErrorMessage';
import { LoaderPage, ModalsChildren, useApi, useNotifications } from '../../index';
import CollapsableError from '../error/CollapsableError';

interface Props {
    onSwitchSession: (data: ProduceForkParameters & { activeSessions: LocalSessionResponse[] }) => void;
    onInvalidFork: () => void;
}

const SSOForkProducer = ({ onSwitchSession, onInvalidFork }: Props) => {
    const [loading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useEffect(() => {
        const run = async () => {
            const { app, state, localID, sessionKey } = getProduceForkParameters();
            if (!app || !state || !sessionKey || sessionKey.length !== 32) {
                throw new InvalidForkProduceError();
            }
            // Traverse persisted sessions, find a logged in account, and then get the list of active sessions
            if (localID === undefined) {
                const activeSessions = await getActiveSessions(silentApi);
                return onSwitchSession({ app, state, sessionKey, activeSessions });
            }
            try {
                // Resume session and produce the fork
                await loadOpenPGP();
                const validatedSession = await resumeSession(silentApi, localID);
                await produceFork({
                    api: silentApi,
                    keyPassword: validatedSession.keyPassword,
                    UID: validatedSession.UID,
                    sessionKey,
                    state,
                    app,
                });
            } catch (e) {
                if (e instanceof InvalidForkProduceError) {
                    onInvalidFork();
                    return;
                }
                if (e instanceof InvalidPersistentSessionError) {
                    const activeSessions = await getActiveSessions(silentApi);
                    onSwitchSession({ app, state, sessionKey, activeSessions });
                    return;
                }
                const errorMessage = getApiErrorMessage(e) || 'Unknown error';
                createNotification({ type: 'error', text: errorMessage });
                console.error(error);
                throw e;
            }
        };
        run().catch((e) => setError(e));
    }, []);

    if (error) {
        return <CollapsableError error={error} />;
    }

    if (loading) {
        return (
            <>
                <LoaderPage />;
                <ModalsChildren />
            </>
        );
    }

    return null;
};

export default SSOForkProducer;
