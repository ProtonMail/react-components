import React from 'react';
import { c } from 'ttag';
import { SETTINGS_LOG_AUTH_STATE } from 'proton-shared/lib/interfaces';

import { Alert, Icon, Table, TableBody, TableHeader, TableRow, Time } from '../../components';
import { AUTH_LOG_EVENTS, AuthLog } from './interface';
import { getEventsI18N } from './helper';

const getIcon = (event: AUTH_LOG_EVENTS) => {
    if ([AUTH_LOG_EVENTS.LOGIN_FAILURE_PASSWORD, AUTH_LOG_EVENTS.LOGIN_FAILURE_2FA].includes(event)) {
        return <Icon name="off" />;
    }
    return <Icon name="on" />;
};

interface Props {
    logs: AuthLog[];
    logAuth: SETTINGS_LOG_AUTH_STATE;
    loading: boolean;
}

const LogsTable = ({ logs, logAuth, loading }: Props) => {
    const i18n = getEventsI18N();

    if (logAuth === SETTINGS_LOG_AUTH_STATE.DISABLE) {
        return (
            <Alert>{c('Info')
                .t`You can enable authentication logging to see when your account is accessed, and from which IP. We will record the IP address that accesses the account and the time, as well as failed attempts.`}</Alert>
        );
    }

    if (!loading && !logs.length) {
        return <Alert>{c('Info').t`No logs yet.`}</Alert>;
    }

    return (
        <Table>
            <TableHeader
                cells={[
                    c('Header').t`Event`,
                    logAuth === SETTINGS_LOG_AUTH_STATE.ADVANCED ? 'IP' : '',
                    c('Header').t`Time`,
                ]}
            />
            <TableBody loading={loading} colSpan={3}>
                {logs.map(({ Time: time, Event, IP }, index) => {
                    const key = index.toString();

                    return (
                        <TableRow
                            key={key}
                            cells={[
                                <>
                                    {getIcon(Event)} {i18n[Event]}
                                </>,
                                logAuth === SETTINGS_LOG_AUTH_STATE.ADVANCED ? <code>{IP || '-'}</code> : '',
                                <Time key={key} format="PPp">
                                    {time}
                                </Time>,
                            ]}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default LogsTable;
