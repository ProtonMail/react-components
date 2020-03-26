import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';

const DropdownMenuLink = ({ className = '', children, ...rest }) => {
    return (
        <a className={classnames(['dropDown-item-link w100 pr1 pl1 pt0-5 pb0-5 bl nodecoration', className])} {...rest}>
            {children}
        </a>
    );
};

DropdownMenuLink.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default DropdownMenuLink;
