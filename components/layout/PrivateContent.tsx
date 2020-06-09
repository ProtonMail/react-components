import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const PrivateContent = React.forwardRef(({ className, children, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div
            className={classnames(['content flex-item-fluid flex flex-column flex-nowrap reset4print', className])}
            ref={ref}
            {...rest}
        >
            {children}
        </div>
    );
});

export default PrivateContent;
