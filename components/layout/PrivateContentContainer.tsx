import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const PrivateContentContainer = React.forwardRef(
    ({ className, children, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
        return (
            <div
                className={classnames(['content-container flex flex-column flex-nowrap no-scroll', className])}
                ref={ref}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

export default PrivateContentContainer;
