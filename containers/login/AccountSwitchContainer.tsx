import React, { FunctionComponent, useEffect, useState } from 'react';
import { c } from 'ttag';
import { useHistory } from 'react-router-dom';

import { getActiveSessions, resumeSession } from 'proton-shared/lib/authentication/helper';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { LocalSessionResponse } from 'proton-shared/lib/authentication/interface';
import { getInitial } from 'proton-shared/lib/helpers/string';
import { APP_NAMES, APPS_CONFIGURATION } from 'proton-shared/lib/constants';
import { wait } from 'proton-shared/lib/helpers/promise';
import { withUIDHeaders } from 'proton-shared/lib/fetch/headers';
import { revoke } from 'proton-shared/lib/api/auth';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/getApiErrorMessage';
import { getPersistedSession, removePersistedSession } from 'proton-shared/lib/authentication/session';

import {
    useApi,
    useLoading,
    LinkButton,
    OnLoginCallbackArguments,
    Alert,
    Loader,
    useNotifications,
    LoaderIcon,
} from '../../index';
import { Props as AccountLayoutProps } from '../signup/AccountPublicLayout';

interface Props {
    Layout: FunctionComponent<AccountLayoutProps>;
    onLogin: (data: OnLoginCallbackArguments) => Promise<void>;
    toAppNameKey: APP_NAMES;
    activeSessions?: LocalSessionResponse[];
}

const AccountSwitchContainer = ({ Layout, toAppNameKey, onLogin, activeSessions }: Props) => {
    const history = useHistory();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });

    const [localActiveSessions, setLocalActiveSessions] = useState(activeSessions);
    const [loading, withLoading] = useLoading(!localActiveSessions);
    const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});
    const [error, setError] = useState(false);
    const { createNotification } = useNotifications();

    const toAppName = APPS_CONFIGURATION[toAppNameKey].name;

    useEffect(() => {
        if (!activeSessions) {
            const run = async () => {
                const activeSessions = await getActiveSessions(silentApi);
                setLocalActiveSessions(activeSessions);
                setLocalActiveSessions([
                    {
                        DisplayName: 'John Carpenter',
                        PrimaryEmail: 'john.carpenter@gmail.com',
                        LocalID: 1,
                        UserID: '',
                    },
                    {
                        DisplayName: 'J Carpenter',
                        PrimaryEmail: 'jc@gmail.com',
                        LocalID: 2,
                        UserID: '',
                    },
                    {
                        DisplayName: 'Home improvements',
                        PrimaryEmail: 'admin@homeimprovements.com',
                        LocalID: 3,
                        UserID: '',
                    },
                ]);
            };
            withLoading(run().catch(() => setError(true)));
        }
    }, []);

    const handleSignOutAll = async () => {
        localActiveSessions?.map(({ LocalID }) => {
            const persistedSession = getPersistedSession(LocalID);
            removePersistedSession(LocalID);
            if (persistedSession && persistedSession.UID) {
                return silentApi(withUIDHeaders(persistedSession.UID, revoke()));
            }
        });
        history.push('/login');
    };

    const handleAddAccount = () => {
        history.push('/login');
    };

    const handleClickSession = async (localID: number) => {
        try {
            setLoadingMap((old) => ({ ...old, [localID]: true }));
            await wait(1000);
            const validatedSession = await resumeSession(silentApi, localID);
            await onLogin({
                keyPassword: validatedSession.keyPassword,
                UID: validatedSession.UID,
            });
        } catch (e) {
            if (e instanceof InvalidPersistentSessionError) {
                setLocalActiveSessions((list) => {
                    return list?.filter(({ LocalID: otherLocalID }) => otherLocalID !== localID);
                });
                createNotification({
                    type: 'error',
                    text: c('Error').t`The account has been signed out. Please sign in again.`,
                });
                return;
            }
            const errorMessage = getApiErrorMessage(e) || 'Unknown error';
            createNotification({ type: 'error', text: errorMessage });
            console.error(error);
        } finally {
            setLoadingMap((old) => ({ ...old, [localID]: true }));
        }
    };

    const inner = () => {
        if (error) {
            return (
                <Alert type="error">{c('Error')
                    .t`Failed to get active sessions. Please refresh or try again later.`}</Alert>
            );
        }
        if (loading) {
            return <Loader />;
        }
        if (!localActiveSessions?.length) {
            return <Alert type="error">{c('Error').t`No active sessions`}</Alert>;
        }
        return localActiveSessions.map(({ DisplayName, Username, LocalID, PrimaryEmail }) => {
            const nameToDisplay = DisplayName || Username || '';
            const initials = getInitial(nameToDisplay);
            return (
                <div
                    key={LocalID}
                    className="flex flex-items-center flex-nowrap p0-5 "
                    onClick={() => handleClickSession(LocalID)}
                >
                    <span className="mtauto mbauto bordered rounded p0-25 inbl relative flex flex-item-noshrink">
                        <span className="center">{loadingMap[LocalID] ? <LoaderIcon /> : initials}</span>
                    </span>
                    <div className="">{nameToDisplay}</div>
                    <div className="">{PrimaryEmail}</div>
                </div>
            );
        });
    };

    return (
        <Layout
            title={c('Title').t`Choose an account`}
            right={<LinkButton onClick={handleSignOutAll}>{c('Action').t`Sign out all accounts`}</LinkButton>}
        >
            <p>{c('Info').t`To continue to ${toAppName}`}</p>
            <div>
                {inner()}
                <div>
                    <LinkButton onClick={handleAddAccount}>{c('Action').t`Add account`}</LinkButton>
                </div>
            </div>
        </Layout>
    );
};

export default AccountSwitchContainer;
