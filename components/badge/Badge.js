import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, classnames } from 'react-components';

const CLASSNAMES = {
    success: 'badgeLabel-success',
    default: 'badgeLabel',
    origin: 'badgeLabel-grey',
    warning: 'badgeLabel-warning',
    error: 'badgeLabel-error',
    primary: 'badgeLabel-primary'
};

const wrapTooltip = (children, title) => <Tooltip title={title}>{children}</Tooltip>;

const Badge = ({ children, type = 'default', tooltip, className = 'mr1' }) => {
    let badge = <span className={classnames([CLASSNAMES[type], className])}>{children}</span>;

    if (tooltip) {
        badge = wrapTooltip(badge, tooltip);
    }

    return badge;
};

Badge.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    tooltip: PropTypes.string
};

export default Badge;
