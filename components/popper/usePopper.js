import { useState, useEffect } from 'react';
import { adjustPosition, computedSize } from './utils';

const usePopper = (
    popperRef,
    anchor,
    visible,
    { originalPlacement = 'bottom', offset = 10, scrollContainerClass = null } = {}
) => {
    const [placement, setPlacement] = useState(originalPlacement);
    const [position, setPosition] = useState({ top: -1000, left: -1000 });

    useEffect(() => {
        const updatePosition = () => {
            if (visible && popperRef && anchor) {
                const tooltipBounds = popperRef.current.getBoundingClientRect();
                const tooltipStyles = window.getComputedStyle(popperRef.current);
                const tooltipTarget = {
                    top: tooltipBounds.top,
                    left: tooltipBounds.left,
                    width: computedSize(tooltipStyles.width, tooltipBounds.width),
                    height: computedSize(tooltipStyles.height, tooltipBounds.height)
                };

                let anchorTarget;

                if (anchor.current) {
                    const wrapperBounds = anchor.current.getBoundingClientRect();
                    const wrapperStyles = window.getComputedStyle(anchor.current);
                    anchorTarget = {
                        top: wrapperBounds.top,
                        left: wrapperBounds.left,
                        width: computedSize(wrapperStyles.width, wrapperBounds.width),
                        height: computedSize(wrapperStyles.height, wrapperBounds.height)
                    };
                } else {
                    anchorTarget = {
                        top: anchor.y,
                        left: anchor.x,
                        width: 0,
                        height: 0
                    };
                }
                const adjusted = adjustPosition(anchorTarget, tooltipTarget, originalPlacement, offset);
                setPlacement(adjusted.placement);
                setPosition(adjusted.position);
            } else {
                setPlacement(originalPlacement);
                setPosition({ top: -1000, left: -1000 });
            }
        };

        updatePosition();

        if (visible) {
            const contentArea =
                (scrollContainerClass && document.getElementsByClassName(scrollContainerClass)[0]) || document.body;
            contentArea.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
            return () => {
                contentArea.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [visible, anchor, popperRef.current]);

    return { position, placement };
};

export default usePopper;
