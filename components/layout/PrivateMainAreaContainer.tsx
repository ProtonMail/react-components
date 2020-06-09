import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const PrivateMainAreaContainer = React.forwardRef(
    ({ className, children, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
        return (
            <div
                className={classnames(['main flex flex-column flex-nowrap flex-item-fluid', className])}
                ref={ref}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

export default PrivateMainAreaContainer;
