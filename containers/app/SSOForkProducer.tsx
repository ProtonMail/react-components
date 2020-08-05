import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { resumeSession } from 'proton-shared/lib/authentication/helper';
import {
    getProduceForkParameters,
    produceFork,
    ProduceForkParameters,
} from 'proton-shared/lib/authentication/forking';
import { InvalidForkProduceError, InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { useHistory } from 'react-router-dom';
import { LoaderPage, ModalsChildren, useApi } from '../../index';
import CollapsableError from '../error/CollapsableError';

interface Props {
    onSwitchSession: (data: ProduceForkParameters) => void;
    onInvalidFork: () => void;
}

const SSOForkProducer = ({ onSwitchSession, onInvalidFork }: Props) => {
    const [loading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const api = useApi();

    useEffect(() => {
        const run = async () => {
            const { app, state, localID, sessionKey } = getProduceForkParameters();
            if (!app || !state || !sessionKey || sessionKey.length !== 32) {
                throw new InvalidForkProduceError();
            }
            // Traverse persisted sessions, find a logged in account, and then get the list of active sessions
            if (localID === undefined) {
                return onSwitchSession({ app, state, sessionKey });
            }
            try {
                // Resume session and produce the fork
                await loadOpenPGP();
                const validatedSession = await resumeSession(api, localID);
                await produceFork({
                    api,
                    keyPassword: validatedSession.keyPassword,
                    UID: validatedSession.UID,
                    sessionKey,
                    state,
                    app
                });
            } catch (e) {
                if (e instanceof InvalidForkProduceError) {
                    onInvalidFork();
                    return;
                }
                if (e instanceof InvalidPersistentSessionError) {
                    onSwitchSession({ app, state, sessionKey });
                    return;
                }
                throw e;
            }
        }

        run()
            .catch((e) => setError(e));
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
