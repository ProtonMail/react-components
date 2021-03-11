import React, { FunctionComponent, useEffect, useState } from 'react';
import { c } from 'ttag';
import { APP_NAMES } from 'proton-shared/lib/constants';

import { resumeSession, getActiveSessions } from 'proton-shared/lib/authentication/persistedSessionHelper';
import { getPersistedSession, removePersistedSession } from 'proton-shared/lib/authentication/persistedSessionStorage';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { LocalSessionResponse } from 'proton-shared/lib/authentication/interface';
import { getInitials } from 'proton-shared/lib/helpers/string';
import { wait } from 'proton-shared/lib/helpers/promise';
import { withUIDHeaders } from 'proton-shared/lib/fetch/headers';
import { revoke } from 'proton-shared/lib/api/auth';
import { noop } from 'proton-shared/lib/helpers/function';

import { LinkButton, Loader, LoaderIcon } from '../../components';
import { useApi, useErrorHandler, useLoading, useNotifications } from '../../hooks';
import { OnLoginCallbackArguments } from '../app/interface';
import { Props as AccountLayoutProps } from '../signup/AccountPublicLayout';
import { getToAppName } from '../signup/helpers/helper';

interface Props {
    Layout: FunctionComponent<AccountLayoutProps>;
    onLogin: (data: OnLoginCallbackArguments) => Promise<void>;
    toApp?: APP_NAMES;
    activeSessions?: LocalSessionResponse[];
    onSignOutAll: () => void;
    onAddAccount: () => void;
}

const compareSessions = (a: LocalSessionResponse, b: LocalSessionResponse) => {
    if (a.DisplayName && b.DisplayName) {
        return a.DisplayName.localeCompare(b.DisplayName);
    }
    if (a.Username && b.Username) {
        return a.Username.localeCompare(b.Username);
    }
    if (a.PrimaryEmail && b.PrimaryEmail) {
        return a.PrimaryEmail.localeCompare(b.PrimaryEmail);
    }
    return 0;
};

const sortSessions = (sessions: LocalSessionResponse[]) => {
    return [...sessions].sort(compareSessions);
};

const AccountSwitchContainer = ({ Layout, toApp, onLogin, activeSessions, onAddAccount, onSignOutAll }: Props) => {
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const errorHandler = useErrorHandler();

    const [localActiveSessions, setLocalActiveSessions] = useState(activeSessions);
    const [loading, withLoading] = useLoading(!localActiveSessions);
    const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});
    const [error, setError] = useState(false);
    const { createNotification } = useNotifications();

    useEffect(() => {
        if (!activeSessions) {
            const run = async () => {
                const { sessions } = await getActiveSessions(silentApi);
                setLocalActiveSessions(sessions);
            };
            withLoading(run().catch(() => setError(true)));
        }
    }, []);

    const handleSignOutAll = async () => {
        localActiveSessions?.map(({ LocalID }) => {
            const persistedSession = getPersistedSession(LocalID);
            removePersistedSession(LocalID);
            if (persistedSession && persistedSession.UID) {
                return silentApi(withUIDHeaders(persistedSession.UID, revoke())).catch(noop);
            }
            return undefined;
        });
        onSignOutAll();
    };

    const handleClickSession = async (localID: number) => {
        try {
            setLoadingMap((old) => ({ ...old, [localID]: true }));
            await wait(1000);
            const validatedSession = await resumeSession(silentApi, localID);
            await onLogin(validatedSession);
        } catch (e) {
            if (e instanceof InvalidPersistentSessionError) {
                setLocalActiveSessions((list) => {
                    return list?.filter(({ LocalID: otherLocalID }) => otherLocalID !== localID);
                });
                createNotification({
                    type: 'error',
                    text: c('Error').t`The session has expired. Please sign in again.`,
                });
                return;
            }
            errorHandler(e);
        } finally {
            setLoadingMap((old) => ({ ...old, [localID]: false }));
        }
    };

    const listItemClassName = 'flex flex-align-items-center w100 pl1 pr1 pt0-75 pb0-75 border-bottom text-left';

    const inner = () => {
        if (error) {
            return (
                <div className={listItemClassName}>{c('Error')
                    .t`Failed to get active sessions. Please refresh or try again later.`}</div>
            );
        }
        if (loading) {
            return <Loader />;
        }
        if (!localActiveSessions?.length) {
            return <div className={listItemClassName}>{c('Error').t`No active sessions`}</div>;
        }
        return sortSessions(localActiveSessions).map(({ DisplayName, Username, LocalID, PrimaryEmail }) => {
            const nameToDisplay = DisplayName || Username || PrimaryEmail || '';
            const initials = getInitials(nameToDisplay);
            return (
                <button
                    key={LocalID}
                    className={`${listItemClassName} button-show-on-hover button-account`}
                    onClick={() => handleClickSession(LocalID)}
                >
                    <span className="dropdown-logout-initials rounded p0-25 inline-flex bg-norm">
                        <span className="dropdown-logout-text center text-semibold" aria-hidden="true">
                            {initials}
                        </span>
                    </span>
                    <span className="flex-item-fluid flex flex-column pl1 pr1">
                        <span className="text-semibold text-ellipsis inline-block max-w100" title={nameToDisplay}>
                            {nameToDisplay}
                        </span>
                        <span className="text-ellipsis inline-block max-w100" title={PrimaryEmail}>
                            {PrimaryEmail}
                        </span>
                    </span>
                    <span className="block no-scroll button-show-on-hover-element button-account-login text-semibold text-sm m0">
                        {loadingMap[LocalID] ? <LoaderIcon /> : c('Action').t`Sign in`}
                    </span>
                </button>
            );
        });
    };

    const toAppName = getToAppName(toApp);

    return (
        <Layout
            title={c('Title').t`Choose an account`}
            subtitle={toAppName ? c('Info').t`to continue to ${toAppName}` : undefined}
            right={<LinkButton onClick={handleSignOutAll}>{c('Action').t`Sign out all accounts`}</LinkButton>}
        >
            <div className="tiny-shadow-container button-account-container scroll-if-needed">
                <div className="button-account-container-inner">
                    {inner()}
                    <div className="relative p1">
                        <LinkButton className="text-semibold increase-click-surface" onClick={onAddAccount}>{c('Action')
                            .t`Add account`}</LinkButton>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AccountSwitchContainer;
