import React, { RefObject, createRef } from 'react';

const getWidth = (ref?: RefObject<HTMLLIElement | HTMLUListElement>) => {
    if (!ref || !ref.current) return 0;
    return ref.current.getClientRects()[0].width;
};
const TAB_MARGIN = 10;

export const useIndicator = (tabs: { ref: RefObject<HTMLLIElement> }[], currentTabIndex: number) => {
    const tabsRef = createRef<HTMLUListElement>();

    const [{ scale, translate }, setIndicatorParams] = React.useState({
        scale: 0,
        translate: 0,
    });

    // on each route change, recalculate indicator offset and scale
    React.useEffect(() => {
        const tabWidths = tabs.map(({ ref }) => getWidth(ref));

        const { offset, width } = tabWidths.reduce(
            (acc, tabWidth, index) => {
                // for each tab before current, add its width and margin to offset
                if (index < currentTabIndex) {
                    acc.offset += tabWidth + TAB_MARGIN;
                }
                // for current tab, set indicator width equal to tab width
                if (index === currentTabIndex) acc.width = tabWidth;
                return acc;
            },
            { offset: 0, width: 0 },
        );
        // indicator scale is proportion to whole container width
        setIndicatorParams({
            scale: width / getWidth(tabsRef),
            translate: offset,
        });
    }, [tabs, currentTabIndex]);
    return {
        scale,
        translate,
        ref: tabsRef,
    };
};
