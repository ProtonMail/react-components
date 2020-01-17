import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import { classnames } from '../../helpers/component';

const TYPES = {
    success: 'bg-global-success',
    warning: 'bg-global-attention',
    error: 'bg-global-warning'
};

const RoundedIcon = ({ className = '', type = 'success', padding = 'p0-5', ...rest }) => {
    return (
        <span className={classnames(['inline-flex rounded50 flex-item-noshrink', className, padding, TYPES[type]])}>
            <Icon size="12" className="fill-white" {...rest} />
        </span>
    );
};

RoundedIcon.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    padding: PropTypes.string
};

export default RoundedIcon;
