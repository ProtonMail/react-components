import { useContext } from 'react';

import Context from './context';

const useKeyTransparency = () => {
    return useContext(Context);
};

export default useKeyTransparency;
