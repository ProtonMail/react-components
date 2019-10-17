import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-components';

const MobileNavServices = ({ children, className }) => {
    return <div className={classnames(['p1', className])}>{children}</div>;
};

MobileNavServices.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default MobileNavServices;
