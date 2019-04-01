import { useState } from 'react';

const useModal = (initialState = false) => {
    const [isOpen, setModalState] = useState(initialState);
    const [state, setState] = useState();

    const open = (data) => (setModalState(true), setState(data));
    const close = () => (setModalState(false), setState());
    const toggle = () => {
        const visible = !isOpen;
        setModalState(visible);
        !visible && setState();
    };

    return {
        isOpen,
        state,
        setState,
        open,
        toggle,
        close
    };
};

export default useModal;
