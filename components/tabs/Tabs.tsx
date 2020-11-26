import { clamp } from 'proton-shared/lib/helpers/math';
import React from 'react';
import { useIndicator } from './useIndicator';
import { Tab } from './index.d';
import { classnames } from '../../helpers';

const toKey = (index: number, prefix = '') => `${prefix}${index}`;

interface Props {
    tabs?: Tab[];
    children?: Tab[];
    value: number;
    onChange: (index: number) => void;
    stickyTabs?: boolean;
}

export const Tabs = ({ value, onChange, tabs = [], children, stickyTabs }: Props) => {
    const safeValue = clamp(value, 0, Math.max(tabs.length - 1, 0));
    const key = toKey(safeValue, 'key_');
    const label = toKey(safeValue, 'label_');
    const tabList = tabs || children || [];
    const content = tabList[safeValue]?.content;

    const { ref: containerRef, scale, translate } = useIndicator(tabList, safeValue);

    if (tabs.length === 1) {
        return <>{content}</>;
    }

    return (
        <div className="tabs">
            <nav className={classnames(['tabs-container', stickyTabs && 'sticky-top'])}>
                <ul
                    className="tabs-list"
                    role="tablist"
                    ref={containerRef}
                    style={{ '--translate': translate, '--scale': scale }}
                >
                    {tabList.map(({ title }, index) => {
                        const key = toKey(index, 'key_');
                        const label = toKey(index, 'label_');
                        return (
                            <li key={key} className="tabs-list-item" role="presentation">
                                <button
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onChange(index);
                                    }}
                                    type="button"
                                    className="tabs-list-link"
                                    id={label}
                                    role="tab"
                                    aria-controls={key}
                                    tabIndex={0}
                                    aria-selected={safeValue === index}
                                >
                                    {title}
                                </button>
                            </li>
                        );
                    })}
                    <li className="tabs-indicator" aria-hidden />
                </ul>
            </nav>
            <div id={key} className="tabs-tabcontent pt1" role="tabpanel" aria-labelledby={label}>
                {content}
            </div>
        </div>
    );
};

export default Tabs;
