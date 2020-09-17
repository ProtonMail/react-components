import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { classnames } from '../../helpers';

export interface Props extends LinkProps {
    children: React.ReactNode;
    itemClassName?: string;
}

const SidebarListItemLink = ({ children, itemClassName = 'navigation__link', className, ...rest }: Props) => {
    return (
        <Link className={classnames([itemClassName, className])} {...rest}>
            {children}
        </Link>
    );
};

export const SubSidebarListItemLink = ({ children, ...rest }: Props) => {
    return (
        <SidebarListItemLink itemClassName="navigation__sublink" {...rest}>
            {children}
        </SidebarListItemLink>
    );
};

export default SidebarListItemLink;
