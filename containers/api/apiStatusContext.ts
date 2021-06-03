import { createContext } from 'react';

export const defaultApiStatus = {
    offline: false,
    apiUnreachable: '',
    appVersionBad: false,
    serverTimeUpdated: false,
};

export default createContext(defaultApiStatus);
