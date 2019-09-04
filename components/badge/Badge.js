import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-components';

const CLASSNAMES = {
    success: 'mr1 badgeLabel-success',
    default: 'mr1 badgeLabel',
    origin: 'mr1 badgeLabel-grey',
    warning: 'mr1 badgeLabel-warning',
    error: 'mr1 badgeLabel-error',
    primary: 'mr1 badgeLabel-primary'
};

const wrapTooltip = (children, title) => <Tooltip title={title}>{children}</Tooltip>;

const Badge = ({ children, type = 'default', tooltip }) => {
    let badge = <span className={CLASSNAMES[type]}>{children}</span>;

    if (tooltip) {
        badge = wrapTooltip(badge, tooltip);
    }

    return badge;
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    tooltip: PropTypes.string
};

export default Badge;
