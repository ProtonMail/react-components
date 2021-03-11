import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    aside: ReactNode;
}

const LayoutAside = ({ children, aside }: Props) => {
    return (
        <div className="flex flex-nowrap h100v">
            <main className="flex flex-justify-center flex-item-fluid bg-norm p2 scroll-if-need">{children}</main>
            <aside className="flex-item-fluid bg-weak no-mobile no-tablet">{aside}</aside>
        </div>
    );
};

export default LayoutAside;
