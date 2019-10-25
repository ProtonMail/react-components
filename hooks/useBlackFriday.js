import { useEffect, useState } from 'react';
import { isBlackFriday } from 'proton-shared/lib/helpers/blackfriday';

const EVERY_TEN_MINUTES = 10 * 60 * 1000;

const useBlackFriday = () => {
    const [blackFriday, setBlackFriday] = useState(isBlackFriday);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setBlackFriday(isBlackFriday());
        }, EVERY_TEN_MINUTES);

        return () => {
            clearInterval(intervalID);
        };
    }, []);

    return blackFriday;
};

export default useBlackFriday;
