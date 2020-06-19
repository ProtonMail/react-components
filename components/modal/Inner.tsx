import React from 'react';
import { classnames } from '../../helpers/component';
import useScrollShadows from '../../hooks/useScrollShadows';

interface Props {
    children: React.ReactNode;
    className?: string;
}
const Inner = ({ children, className = '' }: Props) => {
    const { shadowTop, shadowBottom, scrollRef } = useScrollShadows();
    return (
        <>
            {shadowTop}
            <div ref={scrollRef} className={classnames(['pm-modalContentInner', className])}>
                {children}
            </div>
            {shadowBottom}
        </>
    );
};

export default Inner;
