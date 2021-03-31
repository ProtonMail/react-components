import React from 'react';
import { c } from 'ttag';
import { SETTINGS_LOG_AUTH_STATE } from 'proton-shared/lib/interfaces';
import { getAuthLogEventsI18N, AuthLog, AUTH_LOG_EVENTS } from 'proton-shared/lib/authlog';

import { Alert, Icon, Table, TableBody, TableHeader, TableRow, Time } from '../../components';

const { ADVANCED, DISABLE } = SETTINGS_LOG_AUTH_STATE;

const getIcon = (event: AUTH_LOG_EVENTS) => {
    if (
        [
            AUTH_LOG_EVENTS.LOGIN_FAILURE_PASSWORD,
            AUTH_LOG_EVENTS.LOGIN_FAILURE_2FA,
            AUTH_LOG_EVENTS.REAUTH_FAILURE_2FA,
            AUTH_LOG_EVENTS.REAUTH_FAILURE_PASSWORD,
        ].includes(event)
    ) {
        return <Icon className="align-text-bottom color-global-warning" name="times-circle-filled" />;
    }

    return <Icon className="align-text-bottom color-global-success" name="check-circle-filled" />;
};

interface Props {
    logs: AuthLog[];
    logAuth: SETTINGS_LOG_AUTH_STATE;
    loading: boolean;
    error: boolean;
}

const LogsTable = ({ logs, logAuth, loading, error }: Props) => {
    if (logAuth === DISABLE) {
        return (
            <Alert>{c('Info')
                .t`You can enable authentication logging to see when your account is accessed, and from which IP. We will record the IP address that accesses the account and the time, as well as failed attempts.`}</Alert>
        );
    }

    if (!loading && !logs.length) {
        return <Alert>{c('Info').t`No logs yet.`}</Alert>;
    }

    if (!loading && error) {
        return <Alert type="error">{c('Info').t`Failed to fetch logs.`}</Alert>;
    }

    return (
        <Table>
            <TableHeader cells={[c('Header').t`Event`, logAuth === ADVANCED ? 'IP' : '', c('Header').t`Time`]} />
            <TableBody loading={loading} colSpan={3}>
                {logs.map(({ Time: time, Event, IP }, index) => {
                    const key = index.toString();

                    return (
                        <TableRow
                            key={key}
                            cells={[
                                <>
                                    {getIcon(Event)} {getAuthLogEventsI18N(Event)}
                                </>,
                                logAuth === ADVANCED ? <code>{IP || '-'}</code> : '',
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
