import React from 'react';
import { Link as ReactRouterLink, LinkProps } from 'react-router-dom';

import Href, { Props as HrefProps } from './Href';

export interface ExternalProps extends HrefProps {
    to: string;
    external: true;
}

export interface LocalProps extends LinkProps {
    to: string;
    external?: false;
}

export type Props = LocalProps | ExternalProps;
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
