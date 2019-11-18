import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, classnames } from 'react-components';

const CLASSNAMES = {
    success: 'mr1 badgeLabel-success',
    default: 'mr1 badgeLabel',
    origin: 'mr1 badgeLabel-grey',
    warning: 'mr1 badgeLabel-warning',
    error: 'mr1 badgeLabel-error',
    primary: 'mr1 badgeLabel-primary'
};

const wrapTooltip = (children, title) => <Tooltip title={title}>{children}</Tooltip>;

const Badge = ({ children, type = 'default', tooltip, className }) => {
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
