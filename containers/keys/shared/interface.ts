import { algorithmInfo } from 'pmcrypto';

export interface KeyPermissions {
    canReactivate: boolean;
    canExportPublicKey: boolean;
    canExportPrivateKey: boolean;
    canMakePrimary: boolean;
    canMarkObsolete: boolean;
    canMarkNotObsolete: boolean;
    canMarkCompromised: boolean;
    canMarkNotCompromised: boolean;
    canDelete: boolean;
}

export interface KeyActions {
    onDeleteKey: (id: string) => void;
    onExportPrivateKey: (id: string) => void;
    onExportPublicKey: (id: string) => void;
    onReactivateKey: (id: string) => void;
    onSetPrimary: (id: string) => void;
    onSetFlag: (id: string, action: FlagAction) => void;
}

export interface KeyStatus {
    isAddressDisabled: boolean;
    isPrimary: boolean;
    isDecrypted: boolean;
    isCompromised: boolean;
    isObsolete: boolean;
    isLoading: boolean;
}

export interface KeyDisplay {
    ID: string;
    fingerprint: string;
    algorithm: string;
    algorithmInfo?: algorithmInfo;
    status: KeyStatus;
    permissions: KeyPermissions;
}

export enum FlagAction {
    MARK_OBSOLETE,
    MARK_NOT_OBSOLETE,
    MARK_COMPROMISED,
    MARK_NOT_COMPROMISED
}
