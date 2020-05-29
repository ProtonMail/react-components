import React, { useState } from 'react';
import { useIndicator } from './useIndicator';

const toKey = (index: number, prefix = '') => `${prefix}${index}`;

interface Tab {
    title: string;
    content?: React.ReactNode;
    ref: React.RefObject<HTMLLIElement>;
}
interface Props {
    tabs: Tab[];
    preselectedTab?: number;
    extendOutwards?: string;
}

const TabSwitcher = ({ tabs = [], preselectedTab = 0, extendOutwards }: Props) => {
    const [selectedTab, updateSelectedTab] = useState(preselectedTab);
    const key = toKey(selectedTab, 'key_');
    const label = toKey(selectedTab, 'label_');
    const { content } = tabs[selectedTab];
    const { ref: containerRef, scale, translate } = useIndicator(tabs, selectedTab);

    return (
        <div className="tabs-container tabSwitcher" style={{ margin: `0 -${extendOutwards}` }}>
            <nav className="tab-switcher-container" style={{ paddingLeft: extendOutwards }}>
                <ul className="tabs-list" role="tablist" ref={containerRef}>
                    {tabs.map(({ title, ref }, index) => {
                        const key = toKey(index, 'key_');
                        const label = toKey(index, 'label_');
                        return (
                            <li key={key} ref={ref} className="tabs-list-item" role="presentation">
                                <a
                                    onClick={() => updateSelectedTab(index)}
                                    className="tabs-list-link"
                                    id={label}
                                    role="tab"
                                    aria-controls={key}
                                    tabIndex={0}
                                    aria-selected={selectedTab === index}
                                >
                                    {title}
                                </a>
                            </li>
                        );
                    })}
                    <div
                        className="tab-switcher-indicator"
                        style={{ transform: `translateX(${translate}px) scaleX(${scale})` }}
                    />
                </ul>
            </nav>
            <div
                id={key}
                className="tabs-tabcontent pt1"
                role="tabpanel"
                aria-labelledby={label}
                style={{ margin: `0 ${extendOutwards}` }}
            >
                {content}
            </div>
        </div>
    );
};

export default TabSwitcher;
