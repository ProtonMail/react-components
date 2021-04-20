import React from 'react';

import { classnames } from '../../helpers';
import { Scroll } from '../scroll';

interface Props {
    children: React.ReactNode;
    className?: string;
}
const Inner = ({ children, className = '' }: Props) => {
    return (
        <div className={classnames(['modal-content-inner', className])}>
            <Scroll>{children}</Scroll>
        </div>
    );
};

export default Inner;
