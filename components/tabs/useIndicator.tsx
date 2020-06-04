import React, { RefObject, createRef } from 'react';

const getWidth = (ref?: RefObject<HTMLLIElement | HTMLUListElement>) => {
    if (!ref || !ref.current) return 0;
    return ref.current.getClientRects()[0].width;
};

const getComputedMargin = (element: HTMLLIElement) => {
    const value = window.getComputedStyle(element)?.marginRight;
    if (value.includes('px')) return Number(value.slice(0, -2));
    return 0;
}

export const useIndicator = (tabs: { ref: RefObject<HTMLLIElement> }[], currentTabIndex: number) => {
    const tabsRef = createRef<HTMLUListElement>();

    const [{ scale, translate }, setIndicatorParams] = React.useState({
        scale: 0,
        translate: '0px',
    });

    // on each route change, recalculate indicator offset and scale
    React.useEffect(() => {
        const tabsWidthsAndRefs = tabs.map(({ ref }) => ({ref, width: getWidth(ref)}));
        const totalTabWidth = tabsWidthsAndRefs.reduce((acc, {width}) => acc + width, 0)
        if (totalTabWidth > getWidth(tabsRef)) return;

        const { offset, width } = tabsWidthsAndRefs.reduce(
            (acc, {width, ref}, index) => {
                const margin = ref.current ? getComputedMargin(ref.current) : 0;
                // for each tab before current, add its width and margin to offset
                if (index < currentTabIndex) {
                    acc.offset += width + margin;
                }
                // for current tab, set indicator width equal to tab width
                if (index === currentTabIndex) acc.width = width;
                return acc;
            },
            { offset: 0, width: 0 },
        );
        // indicator scale is proportion to whole container width
        setIndicatorParams({
            scale: width / getWidth(tabsRef),
            translate: `${offset}px`,
        });
    }, [tabs, currentTabIndex]);
    return {
        scale,
        translate,
        ref: tabsRef,
    };
};
