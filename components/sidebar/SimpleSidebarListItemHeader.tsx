import React, { useRef } from 'react';
import Icon from '../icon/Icon';
import { classnames } from '../../helpers';
import SidebarListItem from './SidebarListItem';
import { useHotkeys } from '../../hooks';

interface Props {
    toggle: boolean;
    onToggle: (display: boolean) => void;
    hasCaret?: boolean;
    right?: React.ReactNode;
    text: string;
    title?: string;
}

const SimpleSidebarListItemHeader = ({ toggle, onToggle, hasCaret = true, right, text, title }: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useHotkeys(buttonRef, [
        [
            'ArrowRight',
            (e) => {
                e.stopPropagation();
                onToggle(true);
            },
        ],
        [
            'ArrowLeft',
            () => {
                onToggle(false);
            },
        ],
    ]);

    return (
        <SidebarListItem className="navigation__link--groupHeader">
            <div className="flex flex-nowrap">
                <button
                    ref={buttonRef}
                    className="uppercase flex-item-fluid alignleft navigation__link--groupHeader-link"
                    type="button"
                    onClick={() => onToggle(!toggle)}
                    title={title}
                    aria-expanded={toggle}
                >
                    <span className="mr0-5 small">{text}</span>
                    {hasCaret && (
                        <Icon
                            name="caret"
                            className={classnames(['navigation__icon--expand', toggle && 'rotateX-180'])}
                        />
                    )}
                </button>
                {right}
            </div>
        </SidebarListItem>
    );
};

export default SimpleSidebarListItemHeader;
