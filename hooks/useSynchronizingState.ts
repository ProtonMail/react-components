import { useEffect, useState } from 'react';

/*
 * Same as setState with the difference being that the value
 * passed in the argument of the hook is not only an initial
 * value but will synchronize with the returned state should
 * it change (pointer identity).
 */
const useSynchronizingState = <V>(value: V) => {
    const [state, setState] = useState<V>(value);

    useEffect(() => {
        if (state !== value) {
            setState(value);
        }
    }, [value]);

    /*
     * Typed as a tuple, otherwise typescript thinks the
     * returned value is an array of either
     */
    return [state, setState] as [V, typeof setState];
};

export default useSynchronizingState;
