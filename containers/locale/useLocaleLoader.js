import { useContext } from 'react';

import Context from './context';

const useLocaleLoader = () => useContext(Context);

export default useLocaleLoader;
