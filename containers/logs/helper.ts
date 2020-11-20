import { queryLogs } from 'proton-shared/lib/api/logs';
import queryPagesThrottled from 'proton-shared/lib/api/helpers/queryPagesThrottled';
import { Api } from 'proton-shared/lib/interfaces';
import { c } from 'ttag';
import { AUTH_LOG_EVENTS, AuthLog } from './interface';

export const getAllAuthenticationLogs = (api: Api) => {
    const pageSize = 150;

    const requestPage = (Page: number) =>
        api<{ Logs: AuthLog[]; Total: number }>(
            queryLogs({
                Page,
                PageSize: pageSize,
            })
        );

    return queryPagesThrottled({
        requestPage,
        pageSize,
        pagesPerChunk: 10,
        delayPerChunk: 100,
    }).then((pages) => {
        return pages.map(({ Logs }) => Logs).flat();
    });
};

export const getEventsI18N = () => ({
    [AUTH_LOG_EVENTS.LOGIN_FAILURE_PASSWORD]: c('Log event').t`Sign in failure (password)`,
    [AUTH_LOG_EVENTS.LOGIN_SUCCESS]: c('Log event').t`Sign in success`,
    [AUTH_LOG_EVENTS.LOGOUT]: c('Log event').t`Sign out`,
    [AUTH_LOG_EVENTS.LOGIN_FAILURE_2FA]: c('Log event').t`Sign in failure (2FA)`,
    [AUTH_LOG_EVENTS.LOGIN_SUCCESS_AWAIT_2FA]: c('Log event').t`Sign in success (2FA)`,
});
