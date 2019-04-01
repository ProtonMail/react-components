import { useState } from 'react';

const useModal = (initialState = false) => {
    const [state, setModalState] = useState({ show: initialState });
    const open = (data) => setModalState({ show: true, data });
    const close = () => setModalState({ ...state, show: false });
    const toggle = () => setModalState({ ...state, show: !state.show });

    return {
        state,
        open,
        toggle,
        close
    };
};

export default useModal;
