import React from 'react';

import Link, { Props as LinkProps } from '../link/Link';

const SidebarBackButton = ({ children, ...rest }: LinkProps) => {
    return (
        <Link
            className="pm-button pm-button--primaryborder-dark pm-button--large inbl aligncenter bold mt0-25 w100"
            {...rest}
        >
            {children}
        </Link>
    );
};

export default SidebarBackButton;
