import { createContext } from 'react';
import { KeyTransparencyState } from 'proton-shared/lib/interfaces';

export const initialState = {
    ktSelfAuditResult: new Map(),
    lastSelfAudit: 0,
    isRunning: false,
};

export default createContext<KeyTransparencyState>(initialState);
