import React from 'react';

interface Props {
    children: React.ReactNode;
}

const ScrollShadows = ({ children }: Props) => {
    return (
        <div className="relative">
            <div className="scrollshadow-sticky scrollshadow-sticky--top" />
            <div className="scrollshadow-static scrollshadow-static--top" />
            {children}
            <div className="scrollshadow-sticky scrollshadow-sticky--bottom" />
            <div className="scrollshadow-static scrollshadow-static--bottom" />
        </div>
    );
};

export default ScrollShadows;
