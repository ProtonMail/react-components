import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    withToolbar?: boolean;
}
const PrivateMainArea = React.forwardRef(
    ({ className, withToolbar = false, children, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
        return (
            <main
                className={classnames([
                    'flex-item-fluid',
                    withToolbar ? 'main-area--withToolbar' : 'main-area',
                    className
                ])}
                ref={ref}
                {...rest}
            >
                {children}
            </main>
        );
    }
);

export default PrivateMainArea;
