import React, { Ref } from 'react';

import { classnames } from '../../helpers';
import { Scroll } from '../scroll';

interface Props {
    children: React.ReactNode;
    className?: string;
}
const Inner = React.forwardRef<HTMLDivElement, Props>(
    ({ children, className = '' }: Props, ref: Ref<HTMLDivElement>) => {
        return (
            <div ref={ref} className={classnames(['modal-content-inner', className])}>
                <Scroll>{children}</Scroll>
            </div>
        );
    }
);

export default Inner;
