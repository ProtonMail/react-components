import { useState, useEffect } from 'react';

const useModal = (initialState = false) => {
    const [isOpen, setModalState] = useState(initialState);
    const toggle = () => setModalState(!isOpen);
    const open = () => setModalState(true);
    let id;

    const close = () => {
        const modal = document.querySelector('.pm-modalOverlay');
        modal && modal.classList.add('pm-modalOverlay--fadeOut');
        id = setTimeout(() => setModalState(false), 500);
    };

    useEffect(() => {
        return () => {
            clearTimeout(id);
        };
    });

    return {
        isOpen,
        open,
        toggle,
        close
    };
};

export default useModal;
