import React from 'react';

interface Props extends React.HTMLProps<HTMLDetailsElement> {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
}

const Details = ({ children, className, open = false, ...props }: Props) => (
    <details className={className} open={open} {...props}>
        {children}
    </details>
);

export default Details;
