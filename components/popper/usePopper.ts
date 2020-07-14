import { useState, useEffect } from 'react';
import { adjustPosition, computedSize, ALL_PLACEMENTS } from './utils';

const getPosition = (
    anchorEl: HTMLElement,
    popperEl: HTMLElement,
    originalPlacement: string,
    availablePlacements: string[],
    originalPosition:
        | {
              top: number;
              left: number;
          }
        | undefined,
    offset: number
) => {
    const wrapperBounds = anchorEl.getBoundingClientRect();
    const tooltipBounds = popperEl.getBoundingClientRect();

    const wrapperStyles = window.getComputedStyle(anchorEl);
    const tooltipStyles = window.getComputedStyle(popperEl);

    return adjustPosition(
        {
            top: wrapperBounds.top,
            left: wrapperBounds.left,
            width: computedSize(wrapperStyles.width, wrapperBounds.width),
            height: computedSize(wrapperStyles.height, wrapperBounds.height)
        },
        {
            top: tooltipBounds.top,
            left: tooltipBounds.left,
            width: computedSize(tooltipStyles.width, tooltipBounds.width),
            height: computedSize(tooltipStyles.height, tooltipBounds.height)
        },
        originalPlacement,
        offset,
        originalPosition,
        availablePlacements
    );
};

interface Props {
    popperEl?: HTMLElement | null;
    anchorEl?: HTMLElement | null;
    isOpen?: boolean;
    originalPlacement?: string;
    availablePlacements?: string[];
    originalPosition?: {
        top: number;
        left: number;
    };
    offset?: number;
    scrollContainerClass?: string;
}

const usePopper = ({
    popperEl,
    anchorEl,
    isOpen = false,
    originalPlacement = 'bottom',
    availablePlacements = ALL_PLACEMENTS,
    originalPosition,
    offset = 10,
    scrollContainerClass = ''
}: Props) => {
    const initialPosition = originalPosition || { top: -1000, left: -1000 };
    const [placement, setPlacement] = useState(originalPlacement);
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const updatePosition = () => {
            if (anchorEl && popperEl) {
                const { placement: adjustedPlacement, position: adjustedPosition } = getPosition(
                    anchorEl,
                    popperEl,
                    originalPlacement,
                    availablePlacements,
                    originalPosition,
                    offset
                );
                setPlacement(adjustedPlacement);
                setPosition(adjustedPosition);
                return;
            }

            setPlacement(originalPlacement);
            setPosition(initialPosition);
        };

        updatePosition();

        const contentArea =
            (scrollContainerClass && document.getElementsByClassName(scrollContainerClass)[0]) || document.body;

        contentArea.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        return () => {
            contentArea.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, anchorEl, popperEl, initialPosition]);

    return { position, placement };
};

export default usePopper;
