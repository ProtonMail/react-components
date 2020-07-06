import React from 'react';

import { Icon } from '../../index';
import Link, { LocalProps, ExternalProps } from './Link';

interface NavbarProps {
    text: string;
    icon: string;
}

export type Props = (NavbarProps & LocalProps) | (NavbarProps & ExternalProps);

const TopNavbarLink = ({ icon, text, ...rest }: Props) => {
    const iconComponent = <Icon className="topnav-icon mr0-5 flex-item-centered-vert" name={icon} />;
    return (
        <Link {...rest}>
            {iconComponent}
            <span className="navigation-title topnav-linkText">{text}</span>
        </Link>
    );
};

export default TopNavbarLink;
