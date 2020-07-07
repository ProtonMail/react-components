import React, { useState, ReactNode } from 'react';

import { generateUID, usePopperAnchor, Dropdown, DropdownMenu, DropdownMenuButton, Icon } from '../..';

interface Props {
    children: ReactNode;
    menuItems: {
        name: string;
        icon: string;
        onClick: () => void;
    }[];
}

const ContextManu = ({ children, menuItems }: Props) => {
    const [uid] = useState(generateUID('context-menu'));
    const { anchorRef, isOpen, close } = usePopperAnchor<HTMLDivElement>();

    const dropdownMenuButtons = menuItems.map((item) => (
        <DropdownMenuButton key={item.name} className="flex flex-nowrap alignleft" onClick={item.onClick}>
            <Icon className="mt0-25 mr0-5" name={item.icon} />
            {item.name}
        </DropdownMenuButton>
    ));

    return (
        <>
            <div aria-describedby={uid} ref={anchorRef}>
                {children}
            </div>
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} originalPlacement="right">
                <DropdownMenu>{dropdownMenuButtons}</DropdownMenu>
            </Dropdown>
        </>
    );
};

export default ContextManu;
