import { createContext } from 'react';
import { AuthenticationStore } from 'proton-shared/lib/authenticationStore';

// Trusting this always gets set
export default createContext<AuthenticationStore>(null as any);
