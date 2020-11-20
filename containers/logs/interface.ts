export enum AUTH_LOG_EVENTS {
    LOGIN_FAILURE_PASSWORD = 0,
    LOGIN_SUCCESS = 1,
    LOGOUT = 2,
    LOGIN_FAILURE_2FA = 3,
    LOGIN_SUCCESS_AWAIT_2FA = 4,
}

export interface AuthLog {
    AppVersion: string;
    Event: AUTH_LOG_EVENTS;
    IP: string;
    Time: number;
}
