import React from 'react';
import SuperDropdown from './SuperDropdown';
import { usePopperToggle } from '../Popper';
import SuperDropdownButton from './SuperDropdownButton';

const ExampleDropdown = () => {
    const { anchorRef, isOpen, toggle, close } = usePopperToggle();

    return (
        <>
            <SuperDropdownButton buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} hasCaret>
                drop da bass
            </SuperDropdownButton>
            <SuperDropdown isOpen={isOpen} anchorRef={anchorRef} close={close}>
                <div style={{ height: 400 }}>asdfkljasdf</div>
            </SuperDropdown>
        </>
    );
};

export default ExampleDropdown;
