import React from 'react';
import Dropdown from './Dropdown';
import { usePopperAnchor } from '../Popper';
import DropdownAnchorButton from './DropdownAnchorButton';

const ExampleDropdown = () => {
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    return (
        <>
            <DropdownAnchorButton buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} hasCaret>
                drop da bass
            </DropdownAnchorButton>
            <Dropdown isOpen={isOpen} anchorRef={anchorRef} close={close}>
                <div style={{ height: 400 }}>asdfkljasdf</div>
            </Dropdown>
        </>
    );
};

export default ExampleDropdown;
