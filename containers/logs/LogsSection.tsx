import React, { useEffect, useRef, useState } from 'react';
import { c } from 'ttag';
import { fromUnixTime } from 'date-fns';
import { clearLogs, queryLogs } from 'proton-shared/lib/api/logs';
import { updateLogAuth } from 'proton-shared/lib/api/settings';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { SETTINGS_LOG_AUTH_STATE } from 'proton-shared/lib/interfaces';
import { wait } from 'proton-shared/lib/helpers/promise';
import { AuthLog, getAuthLogEventsI18N } from 'proton-shared/lib/authlog';
import {
    Alert,
    Block,
    Button,
    ConfirmModal,
    ButtonGroup,
    Icon,
    Pagination,
    usePaginationAsync,
} from '../../components';
import { useApi, useLoading, useModals, useUserSettings } from '../../hooks';

import LogsTable from './LogsTable';
import WipeLogsButton from './WipeLogsButton';
import { getAllAuthenticationLogs } from './helper';

const { BASIC, DISABLE, ADVANCED } = SETTINGS_LOG_AUTH_STATE;

const INITIAL_STATE = {
    logs: [],
    total: 0,
};
const PAGE_SIZE = 10;

const LogsSection = () => {
    const [settings] = useUserSettings();
    const { createModal } = useModals();
    const [logAuth, setLogAuth] = useState(settings.LogAuth);
    const api = useApi();
    const [state, setState] = useState<{ logs: AuthLog[]; total: number }>(INITIAL_STATE);
    const { page, onNext, onPrevious, onSelect } = usePaginationAsync(1);
    const [loading, withLoading] = useLoading();
    const [loadingRefresh, withLoadingRefresh] = useLoading();
    const [loadingDownload, withLoadingDownload] = useLoading();
    const [error, setError] = useState(false);

    const handleWipe = async () => {
        await api(clearLogs());
        setState(INITIAL_STATE);
    };

    const handleDownload = async () => {
        const Logs = await getAllAuthenticationLogs(api);

        const data = Logs.reduce(
            (acc, { Event, Time, IP }) => {
                acc.push(`${getAuthLogEventsI18N(Event)},${fromUnixTime(Time).toISOString()},${IP}`);
                return acc;
            },
            [['Event', 'Time', 'IP'].join(',')]
        );

        const filename = 'logs.csv';
        const csvString = data.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        downloadFile(blob, filename);
    };

    const confirmDisable = () => {
        return new Promise<void>((resolve, reject) => {
            createModal(
                <ConfirmModal title={c('Title').t`Clear`} onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Warning')
                        .t`By disabling the logs, you will also clear your entire logs history. Are you sure you want to disable the logs?`}</Alert>
                </ConfirmModal>
            );
        });
    };

    const handleLogAuth = (newLogAuthState: SETTINGS_LOG_AUTH_STATE) => async () => {
        if (state.total > 0 && newLogAuthState === DISABLE) {
            await confirmDisable();
        }
        await api(updateLogAuth(newLogAuthState));
        setLogAuth(newLogAuthState);
        if (newLogAuthState === DISABLE) {
            setState(INITIAL_STATE);
        }
    };

    // Handle updates from the event manager
    useEffect(() => {
        setLogAuth(settings.LogAuth);
    }, [settings.LogAuth]);

    const latestRef = useRef<any>();

    const fetchAndSetState = async () => {
        const latest = {};
        latestRef.current = latest;

        setError(false);
        try {
            const { Logs, Total } = await api<{ Logs: AuthLog[]; Total: number }>(
                queryLogs({
                    Page: page - 1,
                    PageSize: 10,
                })
            );
            if (latestRef.current !== latest) {
                return;
            }
            setState({ logs: Logs, total: Total });
        } catch (e) {
            if (latestRef.current !== latest) {
                return;
            }
            setError(true);
        }
    };

    useEffect(() => {
        withLoading(fetchAndSetState());
    }, [page]);

    return (
        <>
            <Alert>{c('Info')
                .t`Logs includes authentication attempts for all Proton services that use your Proton credentials.`}</Alert>
            <Block className="flex flex-justify-space-between flex-align-items-center">
                <div className="flex flex-align-items-center">
                    <ButtonGroup className="mr1">
                        <Button
                            group
                            className={logAuth === DISABLE ? 'is-active' : ''}
                            onClick={handleLogAuth(DISABLE)}
                        >{c('Log preference').t`Disabled`}</Button>
                        <Button
                            group
                            className={logAuth === BASIC ? 'is-active' : ''}
                            onClick={handleLogAuth(BASIC)}
                        >{c('Log preference').t`Basic`}</Button>
                        <Button
                            group
                            className={logAuth === ADVANCED ? 'is-active' : ''}
                            onClick={handleLogAuth(ADVANCED)}
                        >{c('Log preference').t`Advanced`}</Button>
                    </ButtonGroup>
                    <span className="flex-item-noshrink">
                        <Button
                            icon
                            group
                            className="mr1"
                            loading={loadingRefresh}
                            onClick={() => withLoadingRefresh(wait(1000).then(fetchAndSetState))}
                            title={c('Action').t`Refresh`}
                        >
                            <Icon name="reload" />
                        </Button>
                        {state.logs.length ? <WipeLogsButton className="mr1" onWipe={handleWipe} /> : null}
                        {state.logs.length ? (
                            <Button
                                group
                                className="mr1"
                                onClick={() => withLoadingDownload(handleDownload())}
                                loading={loadingDownload}
                            >{c('Action').t`Download`}</Button>
                        ) : null}
                    </span>
                </div>
                <div>
                    <Pagination
                        onNext={onNext}
                        onPrevious={onPrevious}
                        onSelect={onSelect}
                        total={state.total}
                        page={page}
                        limit={PAGE_SIZE}
                    />
                </div>
            </Block>
            <LogsTable logs={state.logs} logAuth={logAuth} loading={loading} error={error} />
        </>
    );
};

export default LogsSection;
