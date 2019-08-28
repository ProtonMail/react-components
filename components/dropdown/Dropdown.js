import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import { classnames } from '../../helpers/component';
import { usePopper, Popper } from '../popper';
import useRightToLeft from '../../containers/rightToLeft/useRightToLeft';
import { noop } from 'proton-shared/lib/helpers/function';

const scrollContainerClass = 'main';

const Dropdown = ({
    anchorRef,
    children,
    className,
    originalPlacement = 'bottom',
    onClose = noop,
    isOpen = false,
    size = 'normal',
    autoClose = true,
    autoCloseOutside = true,
    ...rest
}) => {
    const { isRTL } = useRightToLeft();
    const rtlAdjustedPlacement = originalPlacement.includes('right')
        ? originalPlacement.replace('right', 'left')
        : originalPlacement.replace('left', 'right');

    const popperRef = useRef();
    const { placement, position } = usePopper(popperRef, anchorRef, isOpen, {
        originalPlacement: isRTL ? rtlAdjustedPlacement : originalPlacement,
        offset: 20,
        scrollContainerClass
    });

    const handleKeydown = useCallback((event) => {
        const key = keycode(event);

        if (key === 'escape' && event.target === document.activeElement) {
            onClose();
        }
    }, []);

    const handleClickOutside = useCallback((event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
            !autoCloseOutside ||
            (anchorRef.current && anchorRef.current.contains(event.target)) ||
            (popperRef.current && popperRef.current.contains(event.target))
        ) {
            return;
        }
        onClose();
    }, []);

    const handleScroll = useCallback(() => {
        if (autoCloseOutside) {
            onClose();
        }
    }, []);

    const handleClickContent = () => {
        if (autoClose) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        const scrollContainer = document.getElementsByClassName(scrollContainerClass)[0] || document.body;
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const contentClassName = classnames([
        'dropDown',
        `dropDown--${placement}`,
        size !== 'normal' && `dropDown--${size}`,
        className
    ]);
    return (
        <Popper
            ref={popperRef}
            position={position}
            isOpen={isOpen}
            role="dialog"
            className={contentClassName}
            onClick={handleClickContent}
            {...rest}
        >
            {children}
        </Popper>
    );
};

Dropdown.propTypes = {
    anchorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    originalPlacement: PropTypes.string,
    size: PropTypes.oneOf(['normal', 'narrow', 'wide', 'auto']),
    autoClose: PropTypes.bool,
    autoCloseOutside: PropTypes.bool
};

export default Dropdown;
