import React, { useRef, useState, useEffect } from 'react';
import { generateUID, classnames } from '../../helpers/component';
import { usePopper, Popper, usePopperAnchor } from '../popper';
import useRightToLeft from '../../containers/rightToLeft/useRightToLeft';

const LONG_TAP_TIMEOUT = 1000;

interface Props {
    children: React.ReactNode;
    title?: string;
    originalPlacement?: 'top' | 'bottom' | 'left' | 'right';
    scrollContainerClass?: string;
    className?: string;
}

const Tooltip = ({ children, title, originalPlacement = 'top', scrollContainerClass = 'main', className }: Props) => {
    const [uid] = useState(generateUID('tooltip'));

    const { isRTL } = useRightToLeft();
    const rtlAdjustedPlacement = originalPlacement.includes('right')
        ? originalPlacement.replace('right', 'left')
        : originalPlacement.replace('left', 'right');

    const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
    const { anchorRef, open, close, isOpen } = usePopperAnchor<HTMLSpanElement>();
    const { position, placement } = usePopper({
        popperEl,
        anchorEl: anchorRef.current,
        isOpen,
        originalPlacement: isRTL ? rtlAdjustedPlacement : originalPlacement,
        scrollContainerClass
    });

    const longTapTimeoutRef = useRef(0);
    const ignoreNonTouchEventsRef = useRef(false);
    const ignoreNonTouchEventsTimeoutRef = useRef(0);

    const handleCloseTooltip = () => {
        clearTimeout(longTapTimeoutRef.current);
        longTapTimeoutRef.current = 0;
        clearTimeout(ignoreNonTouchEventsTimeoutRef.current);
        // Clear non-touch events after a small timeout to avoid the focus event accidentally triggering it after touchend
        // touchstart -> touchend -> focus
        ignoreNonTouchEventsTimeoutRef.current = window.setTimeout(() => {
            ignoreNonTouchEventsRef.current = false;
        }, 100);
        close();
    };

    useEffect(() => {
        // Edge case for elements that don't gain focus, they'll never receive a blur event to close the tooltip
        // for example if long-tapping a span with text, this is to force close the tooltip on next touchstart
        document.addEventListener('touchstart', close);
        return () => {
            document.removeEventListener('touchstart', close);
        };
    }, []);

    const handleTouchStart = () => {
        clearTimeout(ignoreNonTouchEventsTimeoutRef.current);
        ignoreNonTouchEventsTimeoutRef.current = 0;
        clearTimeout(longTapTimeoutRef.current);
        // Initiate a long-tap timer to open the tooltip on touch devices
        longTapTimeoutRef.current = window.setTimeout(() => {
            open();
            longTapTimeoutRef.current = 0;
        }, LONG_TAP_TIMEOUT);
        // Also set to ignore non-touch events
        ignoreNonTouchEventsRef.current = true;
    };

    const handleTouchEnd = () => {
        // Tooltip was opened from a long tap, no need to close
        if (isOpen && !longTapTimeoutRef.current) {
            return;
        }
        // Otherwise it's either not opened or it wasn't opened from the long tap, so we can set to close the tooltip
        clearTimeout(longTapTimeoutRef.current);
        longTapTimeoutRef.current = 0;
        handleCloseTooltip();
    };

    const handleMouseEnter = () => {
        if (ignoreNonTouchEventsRef.current) {
            return;
        }
        open();
    };

    const handleMouseLeave = () => {
        if (ignoreNonTouchEventsRef.current) {
            return;
        }
        close();
    };

    const handleFocus = () => {
        if (ignoreNonTouchEventsRef.current) {
            return;
        }
        open();
    };

    return (
        <>
            <span
                ref={anchorRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleCloseTooltip}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-describedby={uid}
                className={className}
            >
                {children}
            </span>
            <Popper
                divRef={setPopperEl}
                id={uid}
                isOpen={!!title && isOpen}
                style={position}
                className={classnames(['tooltip', `tooltip--${placement}`])}
            >
                {title}
            </Popper>
        </>
    );
};

export default Tooltip;
