import { createContext } from 'react';
import { AuthenticationStore } from 'proton-shared/lib/authenticationStore';

export default createContext<AuthenticationStore>();
