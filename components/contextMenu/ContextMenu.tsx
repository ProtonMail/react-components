import React, { useState } from 'react';

import { generateUID, Dropdown, DropdownMenu, DropdownMenuButton, Icon } from '../..';

interface Props {
    isOpen: boolean;
    close: () => void;
    menuItems: {
        name: string;
        icon: string;
        onClick: () => void;
    }[];
}

const ContextMenu = React.forwardRef<HTMLElement, Props>(({ isOpen, close, menuItems }, ref) => {
    const [uid] = useState(generateUID('context-menu'));

    const dropdownMenuButtons = menuItems.map((item) => (
        <DropdownMenuButton key={item.name} className="flex flex-nowrap alignleft" onClick={item.onClick}>
            <Icon className="mt0-25 mr0-5" name={item.icon} />
            {item.name}
        </DropdownMenuButton>
    ));

    return (
        <>
            <Dropdown id={uid} isOpen={isOpen} anchorRef={ref as any} onClose={close} originalPlacement="right">
                <DropdownMenu>{dropdownMenuButtons}</DropdownMenu>
            </Dropdown>
        </>
    );
});

export default ContextMenu;
