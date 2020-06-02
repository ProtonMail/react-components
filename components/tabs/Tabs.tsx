import React, { useState } from 'react';
import { useIndicator } from './useIndicator';
import { classnames } from '../../helpers/component';

const toKey = (index: number, prefix = '') => `${prefix}${index}`;

interface Tab {
    title: string;
    content?: React.ReactNode;
    ref: React.RefObject<HTMLLIElement>;
}
interface Props {
    tabs: Tab[];
    preselectedTab?: number;
    fullWidth?: boolean;
}

const Tabs = ({ tabs = [], preselectedTab = 0, fullWidth }: Props) => {
    const [selectedTab, updateSelectedTab] = useState(preselectedTab);
    const key = toKey(selectedTab, 'key_');
    const label = toKey(selectedTab, 'label_');
    const { content } = tabs[selectedTab];
    const { ref: containerRef, scale, translate } = useIndicator(tabs, selectedTab);

    return (
        <div
            className={classnames(["tabs", fullWidth && 'tabs--extended'])}
        >
            <nav
                className="tabs-container"
            >
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
                        className="tabs-indicator"
                        style={{ transform: `translateX(${translate}px) scaleX(${scale})` }}
                    />
                </ul>
            </nav>
            <div
                id={key}
                className="tabs-tabcontent pt1 pb1"
                role="tabpanel"
                aria-labelledby={label}
            >
                {content}
            </div>
        </div>
    );
};

export default Tabs;
