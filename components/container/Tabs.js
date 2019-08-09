import React, { useState } from 'react';
import PropTypes from 'prop-types';

const toKey = (index, prefix = '') => `${prefix}${index}`;

const Tabs = ({ panels = [], index = 0 }) => {
    const [selected, setSelected] = useState(index);
    const key = toKey(selected, 'key_');
    const label = toKey(selected, 'label_');
    const { content } = panels[selected];

    return (
        <div className="tabs-container">
            <ul className="tabs-list" role="tablist">
                {panels.map(({ title }, index) => {
                    const key = toKey(index, 'key_');
                    const label = toKey(index, 'label_');
                    return (
                        <li key={key} className="tabs-list-item" role="presentation">
                            <a
                                onClick={() => setSelected(index)}
                                className="tabs-list-link"
                                id={label}
                                role="tab"
                                aria-controls={key}
                                tabIndex={selected === index ? '0' : '-1'}
                                aria-selected={selected === index}
                            >
                                {title}
                            </a>
                        </li>
                    );
                })}
            </ul>
            <div id={key} className="tabs-tabcontent" role="tabpanel" aria-labelledby={label}>
                {content}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    panels: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.node
        })
    ),
    index: PropTypes.number
};

export default Tabs;
