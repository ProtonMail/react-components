import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { APP_NAMES } from 'proton-shared/lib/constants';
import { classnames } from '../../helpers';
import { AppLink } from '../link';

export interface Props extends Omit<NavLinkProps, 'to'> {
    children: React.ReactNode;
    itemClassName?: string;
    toApp?: APP_NAMES;
    to: string;
}

const SidebarListItemLink = React.forwardRef(
    (
        { children, itemClassName = 'navigation-link', className, to, toApp, ...rest }: Props,
        ref: React.Ref<HTMLAnchorElement>
    ) => {
        if (toApp) {
            return (
                <AppLink to={to} toApp={toApp} className={classnames([itemClassName, className])} {...rest}>
                    {children}
                </AppLink>
            );
        }
        return (
            <NavLink ref={ref} to={to} className={classnames([itemClassName, className])} {...rest}>
                {children}
            </NavLink>
        );
    }
);

export const SubSidebarListItemLink = ({ children, ...rest }: Props) => {
    return (
        <SidebarListItemLink itemClassName="navigation-sublink" {...rest}>
            {children}
        </SidebarListItemLink>
    );
};

export default SidebarListItemLink;
