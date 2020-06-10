import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    withToolbar?: boolean;
    rowMode?: boolean;
}
const PrivateMainArea = React.forwardRef(
    ({ className, withToolbar = false, children, rowMode = false, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
        return (
            <main
                className={classnames([
                    'flex-item-fluid',
                    withToolbar ? 'main-area--withToolbar' : 'main-area',
                    rowMode ? 'main-area--rowMode' : '',
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
