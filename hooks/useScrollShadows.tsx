import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { classnames } from '../helpers/component';

const getIsScrollTop = (el: HTMLElement) => el.scrollTop === 0;
const getIsScrollBottom = (el: HTMLElement) => el.scrollHeight - el.scrollTop === el.clientHeight;

const useScrollShadows = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrollTop, setIsScrollTop] = useState(true);
    const [isScrollBottom, setIsScrollBottom] = useState(true);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        setIsScrollBottom(getIsScrollBottom(el));
        setIsScrollTop(getIsScrollTop(el));
    }, []);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) {
            return;
        }
        setIsScrollBottom(getIsScrollBottom(el));
        setIsScrollTop(getIsScrollTop(el));
    });

    const shadowTop = useMemo(() => {
        return <div className={classnames(['pm-modalContentInnerTopShadow', isScrollTop ? 'nonvisible' : ''])} />;
    }, [isScrollTop]);

    const shadowBottom = useMemo(() => {
        return <div className={classnames(['pm-modalContentInnerBottomShadow', isScrollBottom ? 'nonvisible' : ''])} />;
    }, [isScrollBottom]);

    return {
        handleScroll,
        shadowTop,
        shadowBottom,
        scrollRef
    };
};

export default useScrollShadows;
