import { createContext } from 'react';

export const defaultApiStatus = {
    offline: false,
    apiUnreachable: '',
    appVersionBad: false,
    serverTime: undefined,
};

export default createContext(defaultApiStatus);
