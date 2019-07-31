import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import { usePopperAnchor } from '../Popper';
import DropdownButton from './DropdownButton';

const SimpleDropdown = ({ content, children, originalPlacement, narrow, autoClose, ...rest }) => {
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    return (
        <>
            <DropdownButton {...rest} buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} hasCaret>
                {content}
            </DropdownButton>
            <Dropdown
                originalPlacement={originalPlacement}
                narrow={narrow}
                autoClose={autoClose}
                isOpen={isOpen}
                anchorRef={anchorRef}
                close={close}
            >
                {children}
            </Dropdown>
        </>
    );
};

SimpleDropdown.propTypes = {
    content: PropTypes.node,
    children: PropTypes.node,
    originalPlacement: PropTypes.string,
    narrow: PropTypes.bool,
    autoClose: PropTypes.bool
};

export default SimpleDropdown;
