import React from 'react';
import { classnames } from '../../helpers';

type Shape = 'outline' | 'ghost';
interface Props {
    children: React.ReactNode;
    shape?: Shape;
    className?: string;
}

const ButtonGroup = ({ children, shape = 'outline', className = '' }: Props, ref: React.Ref<HTMLDivElement>) => (
    <div className={classnames(['button-group', `button-group-${shape}`, className])} ref={ref}>
        {children}
    </div>
);

export default React.forwardRef<HTMLDivElement, Props>(ButtonGroup);
