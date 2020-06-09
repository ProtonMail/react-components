import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const PrivateMainContainer = React.forwardRef(({ className, children, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div className={classnames(['flex flex-item-fluid flex-nowrap', className])} ref={ref} {...rest}>
            {children}
        </div>
    );
});

export default PrivateMainContainer;
