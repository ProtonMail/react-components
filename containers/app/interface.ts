import { User as tsUser } from 'proton-shared/lib/interfaces';
import { AuthenticationStore } from 'proton-shared/lib/authentication/createAuthenticationStore';

export interface OnLoginCallbackArguments {
    UID: string;
    EventID?: string;
    keyPassword?: string;
    User?: tsUser;
    LocalID?: number;
}
export type OnLoginCallback = (data: OnLoginCallbackArguments) => void;

export interface PrivateAuthenticationStore extends AuthenticationStore {
    UID: string;
    logout: () => void;
}

export interface PublicAuthenticationStore {
    login: OnLoginCallback;
}
