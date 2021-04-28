import React from 'react';
import { classnames } from '../../helpers';
import { Box, PolymorphicComponentProps } from '../../helpers/react-polymorphic-box';

interface OwnProps extends React.HTMLAttributes<HTMLAnchorElement> {
    className?: string;
    children?: React.ReactNode;
    href?: string;
    target?: string;
}

export type DropdownMenuLinkProps = PolymorphicComponentProps<'a', OwnProps>;

const DropdownMenuLink = ({
    as: asProp,
    className = '',
    children,
    target = '_blank',
    ...rest
}: DropdownMenuLinkProps) => {
    const as = asProp || 'a';

    return (
        <Box
            as={as}
            className={classnames(['dropdown-item-link w100 pr1 pl1 pt0-5 pb0-5 block text-no-decoration', className])}
            rel="noopener noreferrer"
            target={target}
            {...rest}
        >
            {children}
        </Box>
    );
};

export default DropdownMenuLink;
