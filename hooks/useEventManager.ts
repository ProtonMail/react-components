import { useContext } from 'react';

import Context from '../containers/eventManager/context';

const useEventManager = () => {
    const eventManager = useContext(Context);

    if (!eventManager) {
        throw new Error('Trying to use uninitialized EventManagerContext');
    }

    return eventManager;
};

export default useEventManager;
