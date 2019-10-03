import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';

const Row = ({ children, className = '', ...rest }) => {
    return (
        <div className={classnames(['flex flex-nowrap onmobile-flex-column mb1', className])} {...rest}>
            {children}
        </div>
    );
};

Row.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Row;
