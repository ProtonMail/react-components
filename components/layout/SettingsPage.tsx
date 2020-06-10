import React, { useEffect, useRef, useState } from 'react';
import { SettingsTitle, ErrorBoundary, PrivateMainArea, ObserverSections } from '../../index';
import { SettingsPropsShared } from './interface';

interface Props extends SettingsPropsShared {
    title: string;
    appName: string;
    children: React.ReactNode;
}

const SettingsPage = ({ setActiveSection, location, title, children, appName }: Props) => {
    const mainAreaRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState<number>(0);

    useEffect(() => {
        document.title = `${title} - ${appName}`;
    }, [title]);

    useEffect(() => {
        if (mainAreaRef.current) {
            mainAreaRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    useEffect(() => {
        const hash = location.hash;
        if (!hash) {
            return;
        }

        // Need a delay to let the navigation end
        const handle = setTimeout(() => {
            const el = mainAreaRef.current?.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);

        return () => clearTimeout(handle);
    }, [location.hash]);

    return (
        <PrivateMainArea ref={mainAreaRef} onScroll={handleScroll}>
            <SettingsTitle onTop={!scrollTop}>{title}</SettingsTitle>
            <div className="container-section-sticky">
                <ErrorBoundary>
                    <ObserverSections setActiveSection={setActiveSection}>{children}</ObserverSections>
                </ErrorBoundary>
            </div>
        </PrivateMainArea>
    );
};

export default SettingsPage;
