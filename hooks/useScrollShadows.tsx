import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { classnames } from '../helpers/component';

const getIsScrollTop = (el: HTMLElement) => el.scrollTop === 0;
const getIsScrollBottom = (el: HTMLElement) => el.scrollHeight - el.scrollTop === el.clientHeight;

const useScrollShadows = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrollTop, setIsScrollTop] = useState(true);
    const [isScrollBottom, setIsScrollBottom] = useState(true);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) {
            return;
        }
        let handle: number;
        const cb = () => {
            setIsScrollBottom(getIsScrollBottom(el));
            setIsScrollTop(getIsScrollTop(el));
            // Scroll is not enough since content can change inside. E.g. new children or a textarea getting resized.
            handle = requestAnimationFrame(cb);
        };
        handle = window.requestAnimationFrame(cb);
        return () => {
            window.cancelAnimationFrame(handle);
        };
    }, []);

    const shadowTop = useMemo(() => {
        return <div className={classnames(['scrollShadowTop', isScrollTop ? 'nonvisible' : ''])} />;
    }, [isScrollTop]);

    const shadowBottom = useMemo(() => {
        return <div className={classnames(['scrollShadowBottom', isScrollBottom ? 'nonvisible' : ''])} />;
    }, [isScrollBottom]);

    return {
        shadowTop,
        shadowBottom,
        scrollRef
    };
};

export default useScrollShadows;
