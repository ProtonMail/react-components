import React, { useState, useEffect } from 'react';

import { generateUID, Dropdown, DropdownMenu, DropdownMenuButton, Icon } from '../..';

interface Props {
    isOpen: boolean;
    position?: {
        top: number;
        left: number;
    };
    close: () => void;
    autoClose?: boolean;
    menuItems: {
        name: string;
        icon: string;
        onClick: () => void;
    }[];
}

const ContextMenu = React.forwardRef<HTMLElement, Props>(
    ({ isOpen, position, close, autoClose = true, menuItems }, ref) => {
        const [uid] = useState(generateUID('context-menu'));

        useEffect(() => {
            if (!isOpen) {
                return;
            }

            const handleContextMenu = () => {
                if (autoClose) {
                    close();
                }
            };

            document.addEventListener('contextmenu', handleContextMenu);

            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
            };
        }, [isOpen, autoClose, close]);

        const dropdownMenuButtons = menuItems.map((item) => (
            <DropdownMenuButton key={item.name} className="flex flex-nowrap alignleft" onClick={item.onClick}>
                <Icon className="mt0-25 mr0-5" name={item.icon} />
                {item.name}
            </DropdownMenuButton>
        ));

        const drowpdown = menuItems.length ? (
            <Dropdown
                id={uid}
                isOpen={isOpen}
                originalPosition={position}
                noCaret
                originalPlacement="bottom-left"
                anchorRef={ref as any}
                onClose={close}
            >
                <DropdownMenu>{dropdownMenuButtons}</DropdownMenu>
            </Dropdown>
        ) : null;

        return drowpdown;
    }
);

export default ContextMenu;
