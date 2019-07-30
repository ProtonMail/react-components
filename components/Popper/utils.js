const DEFAULT_TOOLTIP_OFFSET = 10;

// TODO: FIXME: top-center overflow on the right might go to bottom-right first.
export const ALL_PLACEMENTS = [
    'bottom',
    'bottom-left',
    'bottom-right',
    'top',
    'top-left',
    'top-right',
    'left',
    'right'
];

const calculatePosition = (target, tooltip, placement, offset = DEFAULT_TOOLTIP_OFFSET) => {
    const center = {
        top: target.top + target.height / 2 - tooltip.height / 2,
        left: target.left + target.width / 2 - tooltip.width / 2
    };

    const alignAbove = target.top - tooltip.height - offset;
    const alignBelow = target.top + target.height + offset;
    const alignLeft = target.left - tooltip.width - offset;
    const alignRight = target.left + target.width + offset;

    return {
        top: { left: center.left, top: alignAbove },
        bottom: { left: center.left, top: alignBelow },
        left: { top: center.top, left: alignLeft },
        right: { top: center.top, left: alignRight },
        'bottom-left': { left: target.left, top: alignBelow },
        'top-left': { left: target.left, top: alignAbove },
        'bottom-right': { left: target.left - tooltip.width + target.width, top: alignBelow },
        'top-right': { left: target.left - tooltip.width + target.width, top: alignBelow }
    }[placement];
};

const isOutOfScreen = (tooltip, position) => {
    return (
        position.top + tooltip.height > window.innerHeight ||
        position.left + tooltip.width > window.innerWidth ||
        position.top < 0 ||
        position.left < 0
    );
};

const findAlternativePosition = (target, tooltip, offset, availablePlacements = ALL_PLACEMENTS) => {
    if (!availablePlacements.length) {
        return null;
    }
    const [placement, ...rest] = availablePlacements;
    const position = calculatePosition(target, tooltip, placement, offset);

    return isOutOfScreen(tooltip, position)
        ? findAlternativePosition(target, tooltip, offset, rest)
        : { position, placement };
};

export const adjustPosition = (target, tooltip, placement, offset, availablePlacements = ALL_PLACEMENTS) => {
    const position = calculatePosition(target, tooltip, placement, offset);
    if (isOutOfScreen(tooltip, position)) {
        const alternativePosition = findAlternativePosition(target, tooltip, offset, availablePlacements);
        return alternativePosition || { position, placement };
    }
    return { position, placement };
};

export const computedSize = (stylePixels, boundsSize) => {
    const computedStyleSize = Number(stylePixels.replace('px', ''));
    return isNaN(computedStyleSize) ? boundsSize : computedStyleSize;
};
