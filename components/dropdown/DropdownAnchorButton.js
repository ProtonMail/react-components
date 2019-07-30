import React from 'react';
import Button from '../button/Button';
import PropTypes from 'prop-types';
import DropdownCaret from './DropdownCaret';

const DropdownAnchorButton = ({ hasCaret = false, isOpen, children, ...rest }) => {
    return (
        <Button aria-expanded={isOpen} {...rest}>
            <span className="mauto">
                {children}
                {hasCaret && <DropdownCaret isOpen={isOpen} />}
            </span>
        </Button>
    );
};

DropdownAnchorButton.propTypes = {
    hasCaret: PropTypes.bool,
    isOpen: PropTypes.bool,
    children: PropTypes.node
};

export default DropdownAnchorButton;
