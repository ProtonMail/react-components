import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import { classnames } from '../../helpers/component';
import { usePopper, Popper } from '../Popper';
import { noop } from '@babel/types';

// TODO: rework according to placement
const ALIGN_CLASSES = {
    right: 'dropDown--rightArrow',
    left: 'dropDown--leftArrow'
};

const SuperDropdown = ({
    anchorRef,
    children,
    originalPlacement = 'bottom',
    close = noop,
    isOpen = false,
    narrow = false,
    autoClose = true,
    autoCloseOutside = true
}) => {
    const popperRef = useRef();
    const { placement, position } = usePopper(popperRef, anchorRef, isOpen, {
        originalPlacement,
        offset: 20,
        scrollContainerClass: 'main'
    });

    const handleKeydown = (event) => {
        const key = keycode(event);

        if (key === 'escape' && event.target === document.activeElement) {
            close();
        }
    };

    const handleClickOutside = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
            !autoCloseOutside ||
            (anchorRef.current && anchorRef.current.contains(event.target)) ||
            (popperRef.current && popperRef.current.contains(event.target))
        ) {
            return;
        }

        close();
    };

    const handleClickContent = () => {
        if (autoClose) {
            close();
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

    const alignClass = ALIGN_CLASSES[placement];
    const contentClassName = classnames(['dropDown', alignClass, narrow && 'dropDown--narrow']);
    const placementClassName = placement.startsWith('top') ? 'dropDown--above' : '';
    return (
        <Popper
            ref={popperRef}
            position={position}
            isOpen={isOpen}
            role="dialog"
            className={classnames([contentClassName, placementClassName])}
            onClick={handleClickContent}
        >
            {children}
        </Popper>
    );
};

SuperDropdown.propTypes = {
    anchorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    children: PropTypes.node.isRequired,
    close: PropTypes.func,
    isOpen: PropTypes.bool,
    originalPlacement: PropTypes.string,
    narrow: PropTypes.bool,
    autoClose: PropTypes.bool,
    autoCloseOutside: PropTypes.bool
};

export default SuperDropdown;
