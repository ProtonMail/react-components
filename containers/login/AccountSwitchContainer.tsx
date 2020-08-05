import React, { FunctionComponent, useEffect, useState } from 'react';
import { c } from 'ttag';
import { useHistory } from 'react-router-dom';

import { getActiveSessions, resumeSession } from 'proton-shared/lib/authentication/helper';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { LocalSessionResponse } from 'proton-shared/lib/authentication/interface';
import { getInitial } from 'proton-shared/lib/helpers/string';
import { APP_NAMES, APPS_CONFIGURATION } from 'proton-shared/lib/constants';

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
    const api = <T,>(config: any) => normalApi<T>({ ...config, silence: true });

    const [localActiveSessions, setLocalActiveSessions] = useState(activeSessions);
    const [loading, withLoading] = useLoading(!localActiveSessions);
    const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});
    const [error, setError] = useState(false);
    const { createNotification } = useNotifications();

    const toAppName = APPS_CONFIGURATION[toAppNameKey].name;

    useEffect(() => {
        if (!activeSessions) {
            const run = async () => {
                const activeSessions = await getActiveSessions(api);
                setLocalActiveSessions(activeSessions);
            };
            withLoading(run().catch(() => setError(true)));
        }
    }, []);

    const handleSignOutAll = async () => {
        // Clear everything
        history.push('/login');
    };

    const handleClickSession = async (localID: number) => {
        try {
            setLoadingMap((old) => ({ ...old, [localID]: true }));
            const validatedSession = await resumeSession(api, localID);
            await onLogin({
                keyPassword: validatedSession.keyPassword,
                UID: validatedSession.UID,
            });
        } catch (e) {
            if (e instanceof InvalidPersistentSessionError) {
                setLocalActiveSessions((list) => {
                    return list?.filter(({ LocalID: otherLocalID }) => otherLocalID !== localID);
                });
                return;
            }
            console.error(error);
            createNotification({
                type: 'error',
                text: c('Error').t`Failed to resume session. Please refresh or try again later.`,
            });
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
        if (!activeSessions || !activeSessions.length) {
            return <Alert type="error">{c('Error').t`No active sessions`}</Alert>;
        }
        return activeSessions.map(({ DisplayName, Username, LocalID, PrimaryEmail }) => {
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
            <div>{inner()}</div>
        </Layout>
    );
};

export default AccountSwitchContainer;
