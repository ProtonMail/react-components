import { useState } from 'react';

const useModal = (initialState = false) => {
    const [state, setModalState] = useState({ show: initialState });
    const [isLoading, setLoading] = useState(false);
    const open = (data) =>
        setModalState({
            show: true,
            data
        });
    const close = () => (setLoading(false), setModalState({ ...state, show: false }));
    const toggle = () => {
        const show = !state.show;
        setModalState({ ...state, show });
        !show && setLoading(false);
    };

    return {
        state,
        isLoading,
        setLoading,
        open,
        toggle,
        close
    };
};

export default useModal;
