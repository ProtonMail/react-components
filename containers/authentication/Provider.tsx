import React from 'react';
import { AuthenticationStore } from 'proton-shared/lib/authenticationStore';

import AuthenticationContext from './authenticationContext';

interface Props {
    children?: React.ReactNode;
    store: AuthenticationStore;

}
const AuthenticationProvider = ({ store, children }: Props) => {
    return <AuthenticationContext.Provider value={store}>{children}</AuthenticationContext.Provider>;
};

export default AuthenticationProvider;
