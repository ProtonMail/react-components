import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getActiveSessions, resumeSession } from 'proton-shared/lib/authentication/helper';
import { getProduceForkParameters, produceFork, ProduceForkParameters } from 'proton-shared/lib/authentication/forking';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { LocalSessionResponse } from 'proton-shared/lib/authentication/interface';
import { getApiErrorMessage, getIs401Error } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { LoaderPage, ModalsChildren, StandardLoadError, useApi, useNotifications } from '../../index';

interface Props {
    onSwitchSession: (data: ProduceForkParameters, activeSessions: LocalSessionResponse[]) => void;
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
                onInvalidFork();
                return;
            }
            await loadOpenPGP();
            // Show the account switcher if no specific id
            if (localID === undefined) {
                const { sessions } = await getActiveSessions(silentApi);
                return onSwitchSession({ app, state, sessionKey }, sessions);
            }
            try {
                // Resume session and produce the fork
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
                if (e instanceof InvalidPersistentSessionError || getIs401Error(e)) {
                    const { sessions } = await getActiveSessions(silentApi);
                    onSwitchSession({ app, state, sessionKey }, sessions);
                    return;
                }
                throw e;
            }
        };
        run().catch((e) => {
            const errorMessage = getApiErrorMessage(e) || 'Unknown error';
            createNotification({ type: 'error', text: errorMessage });
            console.error(error);
            setError(e);
        });
    }, []);

    if (error) {
        return <StandardLoadError />;
    }

    if (loading) {
        return (
            <>
                <LoaderPage />
                <ModalsChildren />
            </>
        );
    }

    return null;
};

export default SSOForkProducer;
