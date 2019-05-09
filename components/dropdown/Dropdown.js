import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';

import Button from '../button/Button';

const Dropdown = ({
    isOpen,
    children,
    className,
    buttonClassName,
    contentClassName,
    content,
    autoClose,
    autoCloseOutside
}) => {
    const [open, setOpen] = useState(isOpen);
    const wrapperRef = useRef(null);

    const handleClick = () => setOpen(!open);

    const handleKeydown = (event) => {
        const key = keycode(event);

        if (key === 'escape' && event.target === document.activeElement) {
            setOpen(false);
        }
    };

    const handleClickOutside = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!autoCloseOutside || !wrapperRef.current || wrapperRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleClickContent = () => {
        if (autoClose) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    return (
        <div className={className} ref={wrapperRef}>
            <Button className={buttonClassName} onClick={handleClick} aria-expanded={open}>
                {content}
            </Button>
            {open ? (
                <div className={contentClassName} onClick={handleClickContent}>
                    {children}
                </div>
            ) : null}
        </div>
    );
};

Dropdown.propTypes = {
    arrowPosition: PropTypes.string,
    className: PropTypes.string,
    buttonClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    autoClose: PropTypes.bool,
    autoCloseOutside: PropTypes.bool
};

Dropdown.defaultProps = {
    className: 'dropDown inbl',
    contentClassName: 'dropDown-content',
    isOpen: false,
    autoClose: true,
    autoCloseOutside: true
};

export default Dropdown;
