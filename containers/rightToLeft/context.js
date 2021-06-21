import { createContext } from 'react';

export default createContext({ isRTL: document.documentElement.lang === 'fa' });
