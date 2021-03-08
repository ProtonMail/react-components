import React, { useEffect, useRef } from 'react';
import { SettingsSectionTitle, SettingsSection } from '../../containers';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    className?: string;
    observer?: IntersectionObserver;
    title: string;
    children: React.ReactNode;
}

const SubSettingsSection = ({ id, observer, title, children, ...rest }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!observer || !el) {
            return;
        }
        observer.observe(el);
        return () => {
            observer.unobserve(el);
        };
    }, [observer, ref.current]);

    return (
        <>
            <div className="relative">
                <div id={id} className="header-height-anchor" />
            </div>
            <SettingsSection {...rest} ref={ref} data-target-id={id}>
                <SettingsSectionTitle>{title}</SettingsSectionTitle>
                {children}
            </SettingsSection>
        </>
    );
};

export default SubSettingsSection;
