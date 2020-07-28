import React, { useState, useEffect, useRef } from 'react';

import { generateUID, Dropdown } from '../..';
import { CORNERS_ONLY_PLACEMENTS } from '../popper/utils';

interface Props {
    anchorRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    children: React.ReactNode;
    position?: {
        top: number;
        left: number;
    };
    close: () => void;
    autoClose?: boolean;
}

const ContextMenu = ({ anchorRef, children, isOpen, position, close, autoClose = true }: Props) => {
    const [uid] = useState(generateUID('context-menu'));
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleContextMenu = () => {
            if (autoClose) {
                close();
            }
        };

        const handleClickOutside = ({ target }: MouseEvent) => {
            const targetNode = target as Node;
            // Do nothing, if clicking ref element
            if (!autoClose || elementRef.current?.contains(targetNode)) {
                return;
            }
            close();
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [elementRef.current, isOpen, autoClose, close]);

    return (
        <div style={{ display: 'none' }} ref={elementRef}>
            <Dropdown
                id={uid}
                isOpen={isOpen}
                originalPosition={position}
                availablePlacements={CORNERS_ONLY_PLACEMENTS}
                noCaret
                originalPlacement="bottom-left"
                offset={0}
                anchorRef={anchorRef}
                onClose={close}
            >
                {children}
            </Dropdown>
        </div>
    );
};

export default ContextMenu;
