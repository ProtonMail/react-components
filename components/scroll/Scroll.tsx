import React, { useEffect, useRef, useState } from 'react';

import { classnames } from '../../helpers';

const TOLERANCE = 4;

interface ScrollProps extends React.ComponentPropsWithoutRef<'div'> {
    horizontal?: boolean;
}

const Scroll = ({ children, className, horizontal, ...rest }: ScrollProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollChildRef = useRef<HTMLDivElement>(null);
    const [showStartShadow, setShowStartShadow] = useState(false);
    const [showEndShadow, setShowEndShadow] = useState(false);

    const setShadows = (container: HTMLDivElement, child: HTMLDivElement) => {
        const containerRect = container.getBoundingClientRect();

        const childRect = child.getBoundingClientRect();

        const isOnStartEdge = horizontal
            ? containerRect.left - childRect.left < TOLERANCE
            : containerRect.top - childRect.top < TOLERANCE;

        const isOnEndEdge = horizontal
            ? childRect.right - containerRect.right < TOLERANCE
            : childRect.bottom - containerRect.bottom < TOLERANCE;

        if (isOnStartEdge === showStartShadow) {
            setShowStartShadow(!isOnStartEdge);
        }

        if (isOnEndEdge === showEndShadow) {
            setShowEndShadow(!isOnEndEdge);
        }
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setShadows(scrollContainerRef.current!, scrollChildRef.current!);
        });

        resizeObserver.observe(scrollChildRef.current!);

        resizeObserver.observe(scrollContainerRef.current!);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handleScroll = ({ currentTarget: scrollContainer }: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { current: scrollChild } = scrollChildRef;

        /*
         * safeguard if scrollChild hasn't mounted inside the dom yet
         * impossible case I think, since they would render together
         * and a scroll event could only trigger after they are physically
         * mounted, ts doesn't know this though
         */
        if (!scrollChild) {
            return;
        }

        setShadows(scrollContainer, scrollChild);
    };

    const outerClassName = classnames([
        className,
        horizontal ? 'scroll-outer-horizontal' : 'scroll-outer-vertical',
    ]);

    const startShadowClassName = classnames([showStartShadow && 'scroll-start-shadow']);

    const endShadowClassName = classnames([showEndShadow && 'scroll-end-shadow']);

    return (
        <div className={outerClassName} {...rest}>
            <div className={startShadowClassName} aria-hidden="true" />
            <div className={endShadowClassName} aria-hidden="true" />
            <div className="scroll-inner" ref={scrollContainerRef} onScroll={handleScroll}>
                <div className="scroll-child" ref={scrollChildRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Scroll;
