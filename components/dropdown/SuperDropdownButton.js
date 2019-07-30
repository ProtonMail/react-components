import React from 'react';
import Button from '../button/Button';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';
import SuperDropdownCaret from './SuperDropdownCaret';

const SuperDropdownButton = ({ hasCaret = false, isOpen, className = '', children, ...rest }) => {
    return (
        <Button className={classnames(['dropDown', className])} aria-expanded={isOpen} {...rest}>
            <span className="mauto">
                {children}
                {hasCaret && <SuperDropdownCaret isOpen={isOpen} />}
            </span>
        </Button>
    );
};

SuperDropdownButton.propTypes = {
    className: PropTypes.string,
    hasCaret: PropTypes.bool,
    isOpen: PropTypes.bool,
    children: PropTypes.node
};

export default SuperDropdownButton;
