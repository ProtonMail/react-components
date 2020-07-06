import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import Href, { Props as HrefProps } from './Href';

export interface Props extends HrefProps {
    to: string;
    external?: boolean;
}

const Link = (props: Props) => {
    if (props.external) {
        const { to, target = '_self', children, ...rest } = props;
        return (
            <Href url={to} target={target} {...rest}>
                {children}
            </Href>
        );
    }

    const { to, children, ...rest } = props;
    return (
        <ReactRouterLink to={to} {...rest}>
            {children}
        </ReactRouterLink>
    );
};

export default Link;
