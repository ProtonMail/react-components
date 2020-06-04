import React, { RefObject, createRef } from 'react';

const getWidth = (ref?: RefObject<HTMLLIElement | HTMLUListElement>) => {
    if (!ref || !ref.current) return 0;
    return ref.current.getClientRects()[0].width;
};

const getComputedMargin = (element: HTMLLIElement) => {
    const value = window.getComputedStyle(element)?.marginRight;
    if (value.includes('px')) return Number(value.slice(0, -2));
    return 0;
};

const INITIAL_STATE = {
    scale: 0,
    translate: '0px'
};

export const useIndicator = (tabs: { ref: RefObject<HTMLLIElement> }[], currentTabIndex: number) => {
    const tabsRef = createRef<HTMLUListElement>();

    const [{ scale, translate }, setIndicatorParams] = React.useState(INITIAL_STATE);

    // on each route change, recalculate indicator offset and scale
    React.useEffect(() => {
        const tabProperties = tabs.map(({ ref }) => ({ ref, width: getWidth(ref), margin: ref.current ? getComputedMargin(ref.current) : 0 }));
        const totalTabWidth = tabProperties.reduce((acc, { width, margin }) => acc + width + margin, 0);

        if (totalTabWidth > getWidth(tabsRef)) {
            setIndicatorParams(INITIAL_STATE);
            return;
        }

        const { offset, width } = tabProperties.reduce(
            (acc, { width, margin }, index) => {
                // for each tab before current, add its width and margin to offset
                if (index < currentTabIndex) {
                    acc.offset += width + margin;
                }
                // for current tab, set indicator width equal to tab width
                if (index === currentTabIndex) acc.width = width;
                return acc;
            },
            { offset: 0, width: 0 }
        );
        // indicator scale is proportion to whole container width
        setIndicatorParams({
            scale: width / getWidth(tabsRef),
            translate: `${offset}px`
        });
    }, [tabs, currentTabIndex]);
    return {
        scale,
        translate,
        ref: tabsRef
    };
};
