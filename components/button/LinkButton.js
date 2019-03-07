import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import { getClasses } from '../../helpers/component';

const LinkButton = ({ children, className, ...rest }) => {
    return (
        <Button className={getClasses('pm-button-link', className)} {...rest}>
            {children}
        </Button>
    );
};

LinkButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default LinkButton;
