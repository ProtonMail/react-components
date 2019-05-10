import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';

import Button from '../button/Button';

const ALIGN_CLASSES = {
    center: 'dropDown',
    right: 'dropDown-rightArrow',
    left: 'dropDown-leftArrow'
};

const Dropdown = ({ isOpen, children, className, content, autoClose, autoCloseOutside, align, pagination }) => {
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

    const dropdownClassName = ALIGN_CLASSES[align];
    const dropdownMenuClassName = pagination ? 'dropDown-content dropDown-content--pagination' : 'dropDown-content';

    return (
        <div className={dropdownClassName} ref={wrapperRef}>
            <Button className={className} onClick={handleClick} aria-expanded={open}>
                {content}
            </Button>
            <div className={dropdownMenuClassName} onClick={handleClickContent} hidden={!open}>
                {children}
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    align: PropTypes.string,
    pagination: PropTypes.bool,
    autoClose: PropTypes.bool,
    autoCloseOutside: PropTypes.bool
};

Dropdown.defaultProps = {
    isOpen: false,
    autoClose: true,
    align: 'center',
    pagination: false,
    autoCloseOutside: true
};

export default Dropdown;
