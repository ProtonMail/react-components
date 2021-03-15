import createCache, { Cache } from 'proton-shared/lib/helpers/cache';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { createContext } from 'react';

export type ContactCache = Cache<string, Contact>;

export default createContext<ContactCache>(createCache());
