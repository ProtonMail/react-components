import { useState, useEffect } from 'react';
import { debounce } from 'proton-shared/lib/helpers/function';

const getWindowSize = () => {
    return [window.innerWidth, window.innerHeight];
};

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(() => getWindowSize());

    useEffect(() => {
        const onResize = debounce(() => {
            setWindowSize(getWindowSize());
        }, 250);

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
