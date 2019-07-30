import React from 'react';
import Button from '../button/Button';
import PropTypes from 'prop-types';
import SuperDropdownCaret from './SuperDropdownCaret';

const SuperDropdownButton = ({ hasCaret = false, isOpen, children, ...rest }) => {
    return (
        <Button aria-expanded={isOpen} {...rest}>
            <span className="mauto">
                {children}
                {hasCaret && <SuperDropdownCaret isOpen={isOpen} />}
            </span>
        </Button>
    );
};

SuperDropdownButton.propTypes = {
    hasCaret: PropTypes.bool,
    isOpen: PropTypes.bool,
    children: PropTypes.node
};

export default SuperDropdownButton;
