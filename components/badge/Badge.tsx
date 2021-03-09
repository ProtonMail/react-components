import React from 'react';
import Tooltip from '../tooltip/Tooltip';
import { classnames } from '../../helpers';

const CLASSNAMES = {
    default: 'badge-label-norm',
    origin: 'badge-label-strong',
    light: 'badge-label-weak',
    primary: 'badge-label-primary',
    error: 'badge-label-danger',
    warning: 'badge-label-warning',
    success: 'badge-label-success',
    info: 'badge-label-info',
} as const;

const wrapTooltip = (children: React.ReactNode, title: string, className?: string) => (
    <Tooltip title={title} className={className}>
        {children}
    </Tooltip>
);

export interface Props {
    children: React.ReactNode;
    className?: string;
    tooltip?: string;
    type?: keyof typeof CLASSNAMES;
}

const Badge = ({ children, type = 'default', tooltip, className = 'mr1' }: Props) => {
    let badge = <span className={classnames([CLASSNAMES[type], !tooltip && className])}>{children}</span>;

    if (tooltip) {
        badge = wrapTooltip(badge, tooltip, className);
    }

    return badge;
};

export default Badge;
