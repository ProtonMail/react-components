import { createContext } from 'react';
import { AuthenticationStore } from 'proton-shared/lib/authentication/createAuthenticationStore';

// Trusting this always gets set
export default createContext<AuthenticationStore>(null as any);
